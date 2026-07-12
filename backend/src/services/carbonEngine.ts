export interface CarbonInput {
  activityType:
    | 'electricity'
    | 'diesel'
    | 'petrol'
    | 'natural_gas'
    | 'flights'
    | 'train'
    | 'bus'
    | 'shipping'
    | 'waste'
    | 'water'
    | 'paper'
    | 'plastic';
  value: number;
  unit: string;
  region?: string;
}

export interface CalculationResult {
  provider: 'Climatiq' | 'Carbon Interface' | 'CO2 Signal' | 'Local EcoSphere';
  input: CarbonInput;
  emissionFactor: number;
  co2eValue: number; // in tonnes
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  note?: string;
}

const LOCAL_EMISSION_FACTORS: Record<string, { factor: number; unit: string; scope: string }> = {
  electricity: { factor: 0.000409, unit: 'tCO2e/kWh', scope: 'Scope 2' },
  diesel: { factor: 0.00263, unit: 'tCO2e/Liter', scope: 'Scope 1' },
  petrol: { factor: 0.00231, unit: 'tCO2e/Liter', scope: 'Scope 1' },
  natural_gas: { factor: 0.00189, unit: 'tCO2e/m3', scope: 'Scope 1' },
  flights: { factor: 0.00018, unit: 'tCO2e/km', scope: 'Scope 3' },
  train: { factor: 0.000041, unit: 'tCO2e/km', scope: 'Scope 3' },
  bus: { factor: 0.000096, unit: 'tCO2e/km', scope: 'Scope 3' },
  shipping: { factor: 0.000161, unit: 'tCO2e/tonne-km', scope: 'Scope 3' },
  waste: { factor: 0.450, unit: 'tCO2e/tonne', scope: 'Scope 3' },
  water: { factor: 0.000298, unit: 'tCO2e/m3', scope: 'Scope 3' },
  paper: { factor: 0.000919, unit: 'tCO2e/kg', scope: 'Scope 3' },
  plastic: { factor: 0.00196, unit: 'tCO2e/kg', scope: 'Scope 3' },
};

// Retry helper function with exponential backoff and timeout abort signal
async function fetchWithRetry(
  url: string,
  options: any,
  retries = 2,
  delay = 300,
  timeoutMs = 3000
): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal as any,
      });

      clearTimeout(id);

      if (response.ok) {
        return response as any;
      }

      // Retry only on server errors (5xx) or rate limits (429)
      if (response.status !== 429 && response.status < 500) {
        return response as any;
      }
    } catch (err) {
      if (i === retries) throw err;
    }

    // Exponential backoff wait
    await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
  }
  throw new Error('Fetch retry policy failed');
}

// Adapter 1: CO2 Signal grid carbon intensity (electricity only)
async function tryElectricityCarbonIntensity(input: CarbonInput): Promise<CalculationResult | null> {
  if (input.activityType !== 'electricity') return null;
  const key = process.env.CO2SIGNAL_API_KEY;
  if (!key) return null;

  const country = input.region || 'US';
  try {
    const response = await fetchWithRetry(
      `https://api.co2signal.com/v1/latest?countryCode=${country}`,
      {
        method: 'GET',
        headers: { 'auth-token': key },
      },
      1,
      200,
      2500
    );

    if (response.ok) {
      const data = await response.json();
      const intensityG = data.carbonIntensity || 409;
      const intensityT = intensityG / 1000000; // Convert gCO2eq/kWh to tCO2e/kWh
      const totalCo2e = parseFloat((intensityT * input.value).toFixed(4));
      return {
        provider: 'CO2 Signal',
        input,
        emissionFactor: intensityT,
        co2eValue: totalCo2e,
        confidence: 'HIGH',
        timestamp: new Date().toISOString(),
        note: `Calculated using regional grid carbon intensity for ${country}.`,
      };
    }
  } catch (err) {
    console.warn('CO2 Signal API fallback triggered:', err);
  }
  return null;
}

// Adapter 2: Climatiq beta estimator
async function tryClimatiq(input: CarbonInput): Promise<CalculationResult | null> {
  const key = process.env.CLIMATIQ_API_KEY;
  if (!key) return null;

  try {
    const response = await fetchWithRetry(
      'https://beta3.api.climatiq.io/estimate',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emission_factor: {
            activity_id: mapToClimatiqActivityId(input.activityType),
          },
          parameters: {
            [getParameterUnitKey(input.activityType)]: input.value,
            [`${getParameterUnitKey(input.activityType)}_unit`]: input.unit,
          },
        }),
      },
      1,
      300,
      3000
    );

    if (response.ok) {
      const data = await response.json();
      const factor = data.constituent_gases?.co2e || 0.000409;
      return {
        provider: 'Climatiq',
        input,
        emissionFactor: factor,
        co2eValue: parseFloat((data.co2e || (input.value * factor)).toFixed(4)),
        confidence: 'HIGH',
        timestamp: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('Climatiq API fallback triggered:', err);
  }
  return null;
}

// Adapter 3: Carbon Interface estimates
async function tryCarbonInterface(input: CarbonInput): Promise<CalculationResult | null> {
  const key = process.env.CARBON_INTERFACE_API_KEY;
  if (!key) return null;

  try {
    const response = await fetchWithRetry(
      'https://www.carboninterface.com/api/v1/estimates',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mapToCarbonInterfaceBody(input)),
      },
      1,
      300,
      3000
    );

    if (response.ok) {
      const data = await response.json();
      const co2eInKg = data.data?.attributes?.carbon_kg || 0;
      const co2eInTonnes = co2eInKg / 1000;
      return {
        provider: 'Carbon Interface',
        input,
        emissionFactor: parseFloat((co2eInTonnes / (input.value || 1)).toFixed(6)),
        co2eValue: parseFloat(co2eInTonnes.toFixed(4)),
        confidence: 'HIGH',
        timestamp: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('Carbon Interface API fallback triggered:', err);
  }
  return null;
}

// Adapter 4: Local EcoSphere carbon coefficients engine
function runLocalEcoSphere(input: CarbonInput): CalculationResult {
  const meta = LOCAL_EMISSION_FACTORS[input.activityType] || { factor: 0.000409, unit: 'tCO2e/kWh' };
  const co2e = parseFloat((input.value * meta.factor).toFixed(4));
  return {
    provider: 'Local EcoSphere',
    input,
    emissionFactor: meta.factor,
    co2eValue: co2e,
    confidence: 'MEDIUM',
    timestamp: new Date().toISOString(),
    note: 'Operating in Local Carbon Intelligence Mode.',
  };
}

// Main orchestrated entry point
export async function calculateCarbon(input: CarbonInput): Promise<CalculationResult> {
  // 1. If electricity and regional code is set, try grid intensity provider first
  if (input.activityType === 'electricity' && input.region) {
    const intensityResult = await tryElectricityCarbonIntensity(input);
    if (intensityResult) return intensityResult;
  }

  // 2. Try Climatiq
  const climatiqResult = await tryClimatiq(input);
  if (climatiqResult) return climatiqResult;

  // 3. Try Carbon Interface
  const ciResult = await tryCarbonInterface(input);
  if (ciResult) return ciResult;

  // 4. Default fallback to local calculator
  return runLocalEcoSphere(input);
}

// Parameter formatting helper mappers
function mapToClimatiqActivityId(type: string): string {
  switch (type) {
    case 'electricity': return 'electricity-energy_source_grid_mix';
    case 'diesel': return 'fuel-diesel';
    case 'petrol': return 'fuel-petrol';
    case 'natural_gas': return 'fuel-natural_gas';
    case 'flights': return 'transport-passenger_flight';
    case 'train': return 'transport-passenger_train';
    case 'bus': return 'transport-passenger_bus';
    case 'shipping': return 'transport-freight_ship';
    case 'waste': return 'waste-landfill';
    case 'water': return 'water-treatment';
    case 'paper': return 'material-paper';
    case 'plastic': return 'material-plastic';
    default: return 'electricity-energy_source_grid_mix';
  }
}

function getParameterUnitKey(type: string): string {
  switch (type) {
    case 'electricity': return 'energy';
    case 'diesel':
    case 'petrol':
    case 'natural_gas':
      return 'volume';
    case 'flights':
    case 'train':
    case 'bus':
      return 'distance';
    case 'shipping':
      return 'weight_distance';
    case 'waste':
    case 'paper':
    case 'plastic':
      return 'weight';
    case 'water':
      return 'volume';
    default:
      return 'energy';
  }
}

function mapToCarbonInterfaceBody(input: CarbonInput) {
  switch (input.activityType) {
    case 'electricity':
      return {
        type: 'electricity',
        electricity_value: input.value,
        electricity_unit: input.unit.toLowerCase() === 'mwh' ? 'mwh' : 'kwh',
        country: input.region?.toLowerCase() || 'us',
      };
    case 'flights':
      return {
        type: 'flight',
        passengers: 1,
        legs: [
          { departure_airport: 'SFO', destination_airport: 'LAX' }
        ]
      };
    case 'shipping':
      return {
        type: 'shipping',
        weight_value: input.value,
        weight_unit: 'kg',
        distance_value: 100,
        distance_unit: 'km',
        transport_method: 'truck',
      };
    default:
      return {
        type: 'fuel_combustion',
        fuel_source_type: 'dfo',
        fuel_source_value: input.value,
        fuel_source_unit: 'gallon',
      };
  }
}
