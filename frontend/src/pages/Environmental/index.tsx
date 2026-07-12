import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ReportTable, ColumnDef } from '@/components/ui/ReportTable';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { Leaf, Plus, Download } from 'lucide-react';

type TabState = 'overview' | 'tracking' | 'factors' | 'goals' | 'analytics' | 'reports';

interface CarbonTx {
  id: string;
  dept: string;
  activity: string;
  value: number;
  unit: string;
  co2: number;
  date: string;
  status: 'VERIFIED' | 'DRAFT';
}

export const Environmental: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabState>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);

  // New Transaction Form State
  const [formDept, setFormDept] = useState('');
  const [formActivity, setFormActivity] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);

  // Carbon Ledger Transactions State
  const [transactions, setTransactions] = useState<CarbonTx[]>([]);

  // Emission Factors Database
  const [emissionFactors, setEmissionFactors] = useState<any[]>([]);

  // Departments Database List
  const [departmentsList, setDepartmentsList] = useState<any[]>([]);

  // Sustainability Goals Database
  const [sustainabilityGoals, setSustainabilityGoals] = useState<any[]>([]);

  const [dashboardData, setDashboardData] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      const { default: api } = await import('@/api/axiosInstance');
      const [txRes, factorsRes, goalsRes, dashRes, deptsRes] = await Promise.all([
        api.get('/v1/environment/carbon'),
        api.get('/v1/environment/emission-factors'),
        api.get('/v1/environment/goals'),
        api.get('/v1/environment/dashboard'),
        api.get('/v1/departments'),
      ]);

      const mappedTxs = txRes.data.data.map((t: any) => ({
        id: t.id,
        dept: t.department_id,
        activity: t.activity_name,
        value: t.quantity,
        unit: 'units',
        co2: t.carbon_emission || t.emission_value || 0,
        date: (t.transaction_date || t.date || '').split('T')[0],
        status: 'VERIFIED'
      }));
      setTransactions(mappedTxs);
      
      const rawFactors = factorsRes.data.data;
      const mappedFactors = rawFactors.map((f: any) => ({
        id: f.id,
        source: f.activity_name,
        scope: f.category,
        factor: f.factor_value,
        unit: f.unit,
        region: 'Global',
        status: 'ACTIVE'
      }));
      setEmissionFactors(mappedFactors);

      const rawDepts = deptsRes.data.data;
      setDepartmentsList(rawDepts);

      if (rawDepts.length > 0 && !formDept) {
        setFormDept(rawDepts[0].id);
      }
      if (rawFactors.length > 0 && !formActivity) {
        setFormActivity(rawFactors[0].id);
      }
      
      const mappedGoals = goalsRes.data.data.map((g: any) => ({
        id: g.id,
        title: g.title,
        progress: g.target_value > 0 ? Math.min(100, Math.round((g.current_value / g.target_value) * 100)) : 0,
        target: g.deadline.split('T')[0],
        current: `${g.current_value}`,
        goalVal: `${g.target_value}`,
        remaining: `${g.target_value - g.current_value}`,
        category: 'Sustainability'
      }));
      setSustainabilityGoals(mappedGoals);
      setDashboardData(dashRes.data.data);
    } catch(err) {
      console.error('Failed to load dashboard data', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Reports directory
  const environmentalReports = [
    { id: 'rep-1', name: 'FY2026 Scope 1 & 2 Audit Ledger.pdf', type: 'PDF', size: '2.4 MB', date: '2026-06-30' },
    { id: 'rep-2', name: 'Scope 3 Aviation Mileage Logbook.xlsx', type: 'XLSX', size: '4.1 MB', date: '2026-07-02' },
    { id: 'rep-3', name: 'Facilities Greenhouse Gas Disclosures.pdf', type: 'PDF', size: '1.8 MB', date: '2026-07-08' },
  ];

  const totalEmissions = dashboardData ? dashboardData.total_emission : 0;
  const envScore = dashboardData ? dashboardData.environment_score : 0;
  const goalProgress = dashboardData ? dashboardData.goal_progress : 0;

  const departmentRanking = [
    { name: dashboardData ? dashboardData.top_department : 'Loading...', emissions: `${dashboardData ? dashboardData.total_emission : 0} t`, status: 'High' }
  ];

  const monthlyEmissionsTrend = dashboardData 
    ? dashboardData.monthly_emission.map((m: any) => ({ name: m.month, Scope1: m.emission, Scope2: 0, Scope3: 0 }))
    : [];

  const departmentComparison = [
    { name: 'Facilities', value: 210 },
    { name: 'Logistics', value: 140 },
    { name: 'Engineering', value: 85 },
    { name: 'HR', value: 20 },
  ];

  const emissionBreakdown = [
    { name: 'Grid Electricity', value: 420 },
    { name: 'Natural Gas', value: 240 },
    { name: 'Business Flights', value: 180 },
    { name: 'Diesel Fuel', value: 110 },
  ];

  const reductionPathway = [
    { name: '2022', Emissions: 1250 },
    { name: '2023', Emissions: 1120 },
    { name: '2024', Emissions: 980 },
    { name: '2025', Emissions: 840 },
    { name: '2026', Emissions: 710 },
  ];

  // Reusable Table Column definitions
  const transactionColumns: ColumnDef<CarbonTx>[] = [
    { key: 'dept', header: 'Department', sortable: true },
    { key: 'activity', header: 'Activity Type', sortable: true },
    {
      key: 'value',
      header: 'Recorded Quantity',
      render: (row) => `${row.value} ${row.unit}`,
      sortable: true,
    },
    {
      key: 'co2',
      header: 'CO2 Equivalent',
      render: (row) => <span className="font-bold text-primary">{row.co2} t</span>,
      sortable: true,
    },
    { key: 'date', header: 'Log Date', sortable: true },
    {
      key: 'status',
      header: 'Audit Status',
      render: (row) => (
        <Badge variant={row.status === 'VERIFIED' ? 'success' : 'neutral'} className="scale-90">
          {row.status}
        </Badge>
      ),
      sortable: true,
    },
  ];

  const factorColumns: ColumnDef<any>[] = [
    { key: 'source', header: 'Resource Source', sortable: true },
    { key: 'scope', header: 'Framework Scope', sortable: true },
    { key: 'factor', header: 'Coefficient Value', sortable: true },
    { key: 'unit', header: 'Indicator Unit' },
    { key: 'region', header: 'Geographic Region', sortable: true },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'neutral'} className="scale-90">
          {row.status}
        </Badge>
      ),
    },
  ];

  const reportColumns: ColumnDef<any>[] = [
    { key: 'name', header: 'Disclosures Report Name', sortable: true },
    { key: 'type', header: 'Format' },
    { key: 'size', header: 'File Size' },
    { key: 'date', header: 'Compiled Date', sortable: true },
    {
      key: 'actions',
      header: 'Download',
      render: () => (
        <Button variant="outline" size="sm" className="h-8 px-2 text-xs font-bold inline-flex items-center space-x-1">
          <Download className="h-3.5 w-3.5" />
          <span>Retrieve</span>
        </Button>
      ),
    },
  ];

  // Add Transaction Handler
  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValue || isNaN(Number(formValue)) || !formDept || !formActivity) return;

    const val = Number(formValue);
    
    // Find the selected factor from list to get details
    const selectedFactor = emissionFactors.find(f => f.id === formActivity);
    const activityName = selectedFactor ? selectedFactor.source : 'Carbon Emission';
    const activityType = selectedFactor ? selectedFactor.scope : 'electricity';
    const unit = selectedFactor ? selectedFactor.unit : 'kWh';

    // Retrieve active logged in user session UUID
    const savedUserStr = localStorage.getItem('esg_session_user');
    const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
    const user_id = savedUser ? savedUser.id : null;

    try {
      const { default: api } = await import('@/api/axiosInstance');

      // 1. Calculate
      const calcRes = await api.post('/v1/environment/calculate', {
        activityType: activityType.toLowerCase(),
        value: val,
        unit,
        region: 'US',
      });

      const data = calcRes.data;
      setIsLocalMode(data.provider === 'Local EcoSphere Fallback');

      // 2. Save Transaction in Postgres via FastAPI
      await api.post('/v1/environment/carbon', {
        user_id,
        department_id: formDept,
        emission_factor_id: formActivity,
        activity_name: activityName,
        quantity: val
      });

      // 3. Refresh Data
      fetchDashboardData();
    } catch (err) {
      console.warn('API connection failed, activating Local Mode fallback...', err);
      setIsLocalMode(true);

      // Local fallback coefficients mapping
      const localFactors: Record<string, number> = {
        electricity: 0.000409,
        diesel: 0.00263,
        flights: 0.00018,
        natural_gas: 0.00189,
      };
      const factor = localFactors[activityType.toLowerCase()] || 0.000409;
      const co2Val = parseFloat((val * factor).toFixed(4));

      // Resolve human readable department name for display
      const selectedDept = departmentsList.find(d => d.id === formDept);
      const deptName = selectedDept ? selectedDept.name : 'Facilities';

      const fallbackTx: CarbonTx = {
        id: `tx-${Date.now()}`,
        dept: deptName,
        activity: `${activityName} (Local Fallback)`,
        value: val,
        unit,
        co2: co2Val,
        date: formDate,
        status: 'DRAFT',
      };

      setTransactions([fallbackTx, ...transactions]);
    }

    setIsAddModalOpen(false);
    setFormValue('');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tracking', label: 'Carbon Tracking' },
    { id: 'factors', label: 'Emission Factors' },
    { id: 'goals', label: 'Sustainability Goals' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'reports', label: 'Reports' },
  ] as const;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* visual banner */}
      <div className="relative rounded-3xl bg-organic-gradient border border-primary/10 p-8 overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="absolute top-0 right-0 translate-x-[20%] translate-y-[-20%] pointer-events-none opacity-30 select-none">
          <svg width="280" height="280" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0Z" fill="currentColor" fillOpacity="0.05"/>
            <path d="M72 130C72 130 92 100 120 100C148 100 160 122 160 122" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <path d="M45 105C45 105 72 70 110 70C148 70 165 98 165 98" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>
        
        <div className="space-y-2">
          <Badge variant="primary" className="bg-primary/10 text-primary border-primary/10">Scope 1 & 2 & 3 Ledger</Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground/90 flex items-center space-x-2.5">
            <Leaf className="h-8 w-8 text-primary shrink-0 animate-pulse" />
            <span>Environmental Operations Workspace</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            Configure greenhouse gas emission factors, query carbon accounting tables, and track corporate sustainability goals.
          </p>
        </div>
        
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2 self-start md:self-auto h-11 shadow-sm">
          <Plus className="h-4.5 w-4.5" />
          <span>Add Carbon Entry</span>
        </Button>
      </div>

      {/* Tabs navigation panel */}
      <div className="flex items-center space-x-1.5 overflow-x-auto p-1 bg-muted/65 rounded-2xl border border-border/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLocalMode && (
        <div className="flex items-center space-x-2.5 p-3.5 bg-amber-500/15 border border-amber-500/20 text-amber-850 dark:text-amber-400 rounded-2xl text-xs font-bold animate-in fade-in duration-200">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          <span>Operating in Local Carbon Intelligence Mode.</span>
        </div>
      )}

      {/* Stateful Tab Views rendering */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Overview Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-5 border border-border/50 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest block">Environmental Score</span>
                  <h3 className="text-3xl font-extrabold text-foreground/90 mt-1">{envScore}/100</h3>
                </div>
                <Badge variant="success" className="w-fit scale-90 mt-4">AAA Target</Badge>
              </Card>

              <Card className="p-5 border border-border/50 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest block">Total CO₂ footprint</span>
                  <h3 className="text-3xl font-extrabold text-foreground/90 mt-1">{totalEmissions} t</h3>
                </div>
                <span className="text-[10px] text-muted-foreground font-semibold mt-4">FY2026 Cumulative</span>
              </Card>

              <Card className="p-5 border border-border/50 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest block">Carbon Reduction</span>
                  <h3 className="text-3xl font-extrabold text-foreground/90 mt-1">-12.4%</h3>
                </div>
                <span className="text-[10px] text-primary font-bold mt-4">Positive Pathway</span>
              </Card>

              <Card className="p-5 border border-border/50 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest block">Goal Progress</span>
                  <h3 className="text-3xl font-extrabold text-foreground/90 mt-1">{goalProgress}%</h3>
                </div>
                <span className="text-[10px] text-muted-foreground font-semibold mt-4">Active Milestones</span>
              </Card>
            </div>

            {/* Split layout: quick charts + department rankings */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2 shadow-sm border border-border/50">
                <CardHeader className="py-4 px-6 border-b border-border/40">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/80">Monthly Emissions Index (Scope 1, 2, 3)</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <AreaChart data={monthlyEmissionsTrend} xKey="name" dataKeys={['Scope1', 'Scope2', 'Scope3']} height={240} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-1 shadow-sm border border-border/50">
                <CardHeader className="py-4 px-6 border-b border-border/40">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/80">Department Carbon Ranks</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {departmentRanking.map((dept, idx) => (
                      <div key={idx} className="flex justify-between items-center pb-3 border-b border-border/10 last:border-0 last:pb-0">
                        <div>
                          <p className="text-xs font-bold text-foreground/85">{dept.name}</p>
                          <span className="text-[9px] text-muted-foreground font-semibold">Rank #{idx+1}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-primary">{dept.emissions}</p>
                          <Badge variant="neutral" className="scale-75 origin-right">{dept.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'tracking' && (
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="py-4 px-6 border-b border-border/40">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/85">Carbon Accounting Ledger</CardTitle>
              <CardDescription className="text-[10px] mt-0.5">Audit log mapping activities to Scope 1, 2, and 3 conversions.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ReportTable
                data={transactions}
                columns={transactionColumns}
                searchKey="dept"
                searchPlaceholder="Search departments..."
                initialRowsPerPage={5}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'factors' && (
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="py-4 px-6 border-b border-border/40">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/85">GHG Emission Factors reference database</CardTitle>
              <CardDescription className="text-[10px] mt-0.5">Verification coefficients mapped from standard regulatory boards.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ReportTable
                data={emissionFactors}
                columns={factorColumns}
                searchKey="source"
                searchPlaceholder="Search sources..."
                initialRowsPerPage={5}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'goals' && (
          <div className="grid gap-6 md:grid-cols-3">
            {sustainabilityGoals.map((goal) => (
              <Card key={goal.id} className="border border-border/50 shadow-sm flex flex-col justify-between h-[230px] p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="primary" className="scale-90">{goal.category}</Badge>
                    <span className="text-[10px] text-muted-foreground font-semibold">{goal.target}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-foreground/90 leading-tight">{goal.title}</h4>
                </div>

                <div className="space-y-4">
                  <div className="h-2 w-full bg-muted/65 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${goal.progress}%` }} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-wider pt-2 border-t border-border/10">
                    <div>
                      <span>Current</span>
                      <p className="text-xs text-foreground mt-0.5">{goal.current}</p>
                    </div>
                    <div>
                      <span>Target</span>
                      <p className="text-xs text-foreground mt-0.5">{goal.goalVal}</p>
                    </div>
                    <div>
                      <span>Remaining</span>
                      <p className="text-xs text-primary mt-0.5">{goal.remaining}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border border-border/50 shadow-sm">
              <CardHeader className="py-4 px-6 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/80">Department emissions Matrix (tCO2e)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <BarChart data={departmentComparison} xKey="name" dataKeys={['value']} height={220} />
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm">
              <CardHeader className="py-4 px-6 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/80">Emission breakdown by source</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex justify-center">
                <div className="w-full max-w-[320px]">
                  <PieChart data={emissionBreakdown} height={220} />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm md:col-span-2">
              <CardHeader className="py-4 px-6 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/80">Decarbonization Reduction Pathway (tCO2e)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <LineChart data={reductionPathway} xKey="name" dataKeys={['Emissions']} height={240} />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'reports' && (
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="py-4 px-6 border-b border-border/40">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/85">Environmental Disclosures compilation vault</CardTitle>
              <CardDescription className="text-[10px] mt-0.5">Audit reports generated under SASB and GRI frameworks.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ReportTable
                data={environmentalReports}
                columns={reportColumns}
                searchKey="name"
                searchPlaceholder="Search reports by filename..."
                initialRowsPerPage={5}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Carbon Entry Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="New Carbon Ledger Entry">
        <form onSubmit={handleAddEntry} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reporting Department</label>
            <select
              value={formDept}
              onChange={(e) => setFormDept(e.target.value)}
              className="w-full px-3 py-2 bg-muted/20 border border-border/60 rounded-xl text-xs font-semibold focus:outline-none"
            >
              {departmentsList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Activity Source</label>
            <select
              value={formActivity}
              onChange={(e) => setFormActivity(e.target.value)}
              className="w-full px-3 py-2 bg-muted/20 border border-border/60 rounded-xl text-xs font-semibold focus:outline-none"
            >
              {emissionFactors.map((ef) => (
                <option key={ef.id} value={ef.id}>
                  {ef.source} ({ef.scope})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Quantity / Usage value</label>
            <input
              type="text"
              placeholder="e.g. 4500"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              className="w-full px-3 py-2 bg-muted/20 border border-border/60 rounded-xl text-xs font-semibold focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Transaction Date</label>
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full px-3 py-2 bg-muted/20 border border-border/60 rounded-xl text-xs font-semibold focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-border/40">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={!formValue.trim() || isNaN(Number(formValue))}>
              Record Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Environmental;
