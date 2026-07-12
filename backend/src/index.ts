import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { calculateCarbon } from './services/carbonEngine';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini API
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'EcoSphere ESG Platform Backend',
  });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('EcoSphere ESG Management Platform API Server is running.');
});

// Placeholder route hooks for ESG modules
app.use('/api/auth', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Auth endpoint not implemented' });
});

app.use('/api/departments', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Departments endpoint not implemented' });
});

app.post('/api/carbon/calculate', async (req: Request, res: Response) => {
  const { activityType, value, unit, region } = req.body;
  if (!activityType || value === undefined || !unit) {
    return res.status(400).json({ error: 'activityType, value, and unit are required' });
  }

  try {
    const result = await calculateCarbon({
      activityType,
      value: Number(value),
      unit,
      region,
    });
    res.json(result);
  } catch (error: any) {
    console.error('Carbon Calculation Error:', error);
    res.status(500).json({ error: 'Failed to run carbon intelligence calculation', message: error.message });
  }
});

app.use('/api/challenges', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Challenges endpoint not implemented' });
});

app.use('/api/compliance', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Compliance/Policy endpoint not implemented' });
});

app.post('/api/copilot/chat', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!genAI) {
    return res.status(503).json({ error: 'Gemini API is not configured on the backend server' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const systemPrompt = `
You are the EcoSphere ESG Intelligence Assistant, a premium AI sustainability analyst.
You help corporate users analyze Scope 1, 2, and 3 emissions, carbon accounting ledger transactions, compliance frameworks (GRI, SASB), and reduction target pathways.

Rules for response formatting:
1. Provide concise, premium, executive-level insights. Use markdown bullet points and headings.
2. If you want to render a visual chart to help illustrate the data, append exactly one of the following tags at the very end of your response:
   - [CHART:bar] to show comparison between categories/departments.
   - [CHART:pie] to show breakdown/distribution of a total value.
   - [CHART:area] to show cumulative trends or pathways over time.
   - [CHART:radar] to show multi-variable compliance indicators.
3. If you want to present a tabular log of items, use markdown table formatting.
`;
    const result = await model.generateContent([systemPrompt, prompt]);
    const responseText = result.response.text();
    res.json({ text: responseText });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to process prompt with GenAI API', message: error.message });
  }
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[server]: EcoSphere Server is running at http://localhost:${PORT}`);
});

export default app;
