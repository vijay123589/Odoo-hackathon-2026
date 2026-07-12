import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { Leaf, Plus, Milestone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Environmental: React.FC = () => {
  const emissionSources = [
    { name: 'Electricity', value: 420 },
    { name: 'Natural Gas', value: 240 },
    { name: 'Business Travel', value: 180 },
    { name: 'Logistics', value: 110 },
  ];

  const historicalEmission = [
    { year: '2022', Emissions: 1250 },
    { year: '2023', Emissions: 1120 },
    { year: '2024', Emissions: 980 },
    { year: '2025', Emissions: 840 },
  ];

  const recentTransactions = [
    { id: '1', dept: 'Facilities', activity: 'Electricity Usage', value: 4500, unit: 'kWh', co2: 1.84, date: '2026-07-10' },
    { id: '2', dept: 'Logistics', activity: 'Diesel Transport', value: 350, unit: 'Liters', co2: 0.92, date: '2026-07-09' },
    { id: '3', dept: 'Executive Office', activity: 'Business Flights', value: 12000, unit: 'km', co2: 2.16, date: '2026-07-08' },
  ];

  const sustainabilityGoals = [
    { id: 1, title: '100% Renewable Energy', progress: 78, target: 'Dec 2027', category: 'Energy' },
    { id: 2, title: 'Zero Waste to Landfill', progress: 92, target: 'Jun 2026', category: 'Waste' },
    { id: 3, title: 'Reduce Scope 3 Flight Miles', progress: 45, target: 'Dec 2028', category: 'Travel' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Visual Organic Banner */}
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
            <span>Environmental Operations</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            Record, verify, and visualize corporate greenhouse gas emissions, waste management indexes, and active energy reduction pipelines.
          </p>
        </div>
        
        <Button variant="primary" className="flex items-center space-x-2 self-start md:self-auto h-11 shadow-sm">
          <Plus className="h-4.5 w-4.5" />
          <span>Add Carbon Entry</span>
        </Button>
      </div>

      {/* Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>GHG Emissions Over Time (tCO2e)</CardTitle>
            <CardDescription>Historical compliance path compared to carbon-neutrality targets.</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={historicalEmission}
              xKey="year"
              dataKeys={['Emissions']}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emission Breakdown</CardTitle>
            <CardDescription>Distribution of CO2 emissions by resource type.</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={emissionSources} />
          </CardContent>
        </Card>
      </div>

      {/* Goals & Progress Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Goals checklist */}
        <Card className="md:col-span-1 bg-muted/10 border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Milestone className="h-5 w-5 text-primary" />
              <span>Sustainability Milestones</span>
            </CardTitle>
            <CardDescription>Active pathways towards carbon neutrality targets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sustainabilityGoals.map((goal) => (
              <div key={goal.id} className="p-3.5 bg-card border border-border/40 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-foreground/80 leading-none mb-1">{goal.title}</h4>
                    <span className="text-[9px] text-muted-foreground/60 font-semibold uppercase tracking-wider">{goal.category}</span>
                  </div>
                  <span className="text-[10px] text-primary font-bold">{goal.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${goal.progress}%` }} />
                </div>
                <div className="flex justify-between items-center text-[9px] text-muted-foreground/50 font-semibold pt-1 border-t border-border/10">
                  <span>Target: {goal.target}</span>
                  <span>Active Progress</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Side: Ledger Table */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Carbon Ledger Transactions</CardTitle>
            <CardDescription>Audit-trail log of recorded environmental indicators.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Department</TableHead>
                    <TableHead>Activity Type</TableHead>
                    <TableHead>Recorded Quantity</TableHead>
                    <TableHead>CO2 Equivalent (t)</TableHead>
                    <TableHead>Transaction Date</TableHead>
                    <TableHead className="pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-semibold text-foreground/90 pl-6">{tx.dept}</TableCell>
                      <TableCell>{tx.activity}</TableCell>
                      <TableCell className="text-muted-foreground font-semibold">{tx.value} {tx.unit}</TableCell>
                      <TableCell className="font-bold text-primary">{tx.co2} t</TableCell>
                      <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                      <TableCell className="pr-6">
                        <Badge variant="success">Verified</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Environmental;
