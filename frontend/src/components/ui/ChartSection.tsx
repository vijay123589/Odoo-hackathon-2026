import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './Card';
import { Button } from './Button';
import { BarChart } from '../charts/BarChart';
import { AreaChart } from '../charts/AreaChart';
import { LineChart } from '../charts/LineChart';
import { PieChart } from '../charts/PieChart';
import { RadarChart } from '../charts/RadarChart';
import { BarChart2, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';

interface ChartSectionProps {
  reportName: string;
  category: string;
  className?: string;
}

export const ChartSection: React.FC<ChartSectionProps> = ({
  reportName,
  category,
  className = '',
}) => {
  const [activeChart, setActiveChart] = useState<'area' | 'bar' | 'line' | 'pie' | 'radar'>('area');

  // Dummy data sets matching standard visual disclosures
  const carbonTrendData = [
    { name: 'Jan', Scope1: 45, Scope2: 32, Scope3: 110 },
    { name: 'Feb', Scope1: 52, Scope2: 29, Scope3: 95 },
    { name: 'Mar', Scope1: 49, Scope2: 36, Scope3: 115 },
    { name: 'Apr', Scope1: 38, Scope2: 25, Scope3: 88 },
    { name: 'May', Scope1: 41, Scope2: 22, Scope3: 92 },
    { name: 'Jun', Scope1: 33, Scope2: 19, Scope3: 74 },
  ];

  const departmentComparisonData = [
    { name: 'Engineering', emissions: 85, csr: 190, compliance: 95 },
    { name: 'Logistics', emissions: 140, csr: 110, compliance: 88 },
    { name: 'Facilities', emissions: 210, csr: 130, compliance: 92 },
    { name: 'HR', emissions: 20, csr: 260, compliance: 98 },
    { name: 'Sales', emissions: 65, csr: 175, compliance: 90 },
  ];

  const esgCategoryDistribution = [
    { name: 'Environmental', value: 45 },
    { name: 'Social', value: 30 },
    { name: 'Governance', value: 25 },
  ];

  const esgTrendData = [
    { name: 'Q1-25', score: 88 },
    { name: 'Q2-25', score: 90 },
    { name: 'Q3-25', score: 91 },
    { name: 'Q4-25', score: 92 },
    { name: 'Q1-26', score: 94 },
  ];

  const radarMetricData = [
    { subject: 'Emissions Control', target: 80, actual: 84 },
    { subject: 'CSR Hours', target: 90, actual: 95 },
    { subject: 'Diversity Index', target: 85, actual: 88 },
    { subject: 'Policy Attended', target: 100, actual: 100 },
    { subject: 'Audit Score', target: 95, actual: 96 },
  ];

  return (
    <Card className={`border border-border/50 shadow-sm overflow-hidden ${className}`}>
      <CardHeader className="py-4 px-6 border-b border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div>
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/80">Interactive Analytical Visualizations</CardTitle>
          <CardDescription className="text-[10px] mt-0.5 font-semibold text-muted-foreground/75">
            Analysing: {reportName} ({category})
          </CardDescription>
        </div>
        
        {/* Custom Visualizations selector */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-muted/65 p-1 rounded-xl">
          <Button
            variant={activeChart === 'area' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveChart('area')}
            className={`h-8 px-2 text-xs font-bold rounded-lg ${activeChart === 'area' ? '' : 'text-muted-foreground hover:text-foreground'}`}
            title="Area Trend Chart"
          >
            <Activity className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={activeChart === 'bar' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveChart('bar')}
            className={`h-8 px-2 text-xs font-bold rounded-lg ${activeChart === 'bar' ? '' : 'text-muted-foreground hover:text-foreground'}`}
            title="Department Bar Chart"
          >
            <BarChart2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={activeChart === 'line' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveChart('line')}
            className={`h-8 px-2 text-xs font-bold rounded-lg ${activeChart === 'line' ? '' : 'text-muted-foreground hover:text-foreground'}`}
            title="Line ESG Score Trend"
          >
            <TrendingUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={activeChart === 'pie' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveChart('pie')}
            className={`h-8 px-2 text-xs font-bold rounded-lg ${activeChart === 'pie' ? '' : 'text-muted-foreground hover:text-foreground'}`}
            title="Pie Distribution Chart"
          >
            <PieIcon className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={activeChart === 'radar' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveChart('radar')}
            className={`h-8 px-2 text-xs font-bold rounded-lg ${activeChart === 'radar' ? '' : 'text-muted-foreground hover:text-foreground'}`}
            title="Radar Performance Chart"
          >
            <Activity className="h-3.5 w-3.5 rotate-45" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="w-full flex items-center justify-center min-h-[300px]">
          {activeChart === 'area' && (
            <div className="w-full">
              <h4 className="text-xs font-extrabold text-foreground/80 mb-4 uppercase tracking-wider text-center">Carbon Emission Trends (Scope 1, 2 & 3)</h4>
              <AreaChart
                data={carbonTrendData}
                xKey="name"
                dataKeys={['Scope1', 'Scope2', 'Scope3']}
                height={280}
              />
            </div>
          )}
          
          {activeChart === 'bar' && (
            <div className="w-full">
              <h4 className="text-xs font-extrabold text-foreground/80 mb-4 uppercase tracking-wider text-center">Department ESG Performance Matrix</h4>
              <BarChart
                data={departmentComparisonData}
                xKey="name"
                dataKeys={['emissions', 'csr', 'compliance']}
                height={280}
              />
            </div>
          )}

          {activeChart === 'line' && (
            <div className="w-full">
              <h4 className="text-xs font-extrabold text-foreground/80 mb-4 uppercase tracking-wider text-center">Executive ESG Score Trend Alignment</h4>
              <LineChart
                data={esgTrendData}
                xKey="name"
                dataKeys={['score']}
                height={280}
              />
            </div>
          )}

          {activeChart === 'pie' && (
            <div className="w-full flex flex-col items-center">
              <h4 className="text-xs font-extrabold text-foreground/80 mb-4 uppercase tracking-wider text-center">ESG Disclosures Category Distribution</h4>
              <div className="w-full max-w-md">
                <PieChart
                  data={esgCategoryDistribution}
                  height={280}
                />
              </div>
            </div>
          )}

          {activeChart === 'radar' && (
            <div className="w-full">
              <h4 className="text-xs font-extrabold text-foreground/80 mb-4 uppercase tracking-wider text-center">Compliance Targets Target vs Actual Posture</h4>
              <RadarChart
                data={radarMetricData}
                xKey="subject"
                dataKeys={['target', 'actual']}
                height={280}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default ChartSection;
