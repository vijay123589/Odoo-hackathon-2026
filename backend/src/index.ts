import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

app.use('/api/carbon', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Carbon transactions endpoint not implemented' });
});

app.use('/api/challenges', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Challenges endpoint not implemented' });
});

app.use('/api/compliance', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Compliance/Policy endpoint not implemented' });
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
