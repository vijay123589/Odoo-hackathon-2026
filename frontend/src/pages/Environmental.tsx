import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { LineChart } from '../components/charts/LineChart';
import { PieChart } from '../components/charts/PieChart';
import { Leaf, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';

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

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-500 shrink-0" />
            <span>Environmental (E) Metrics</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Track Scope 1, Scope 2, and Scope 3 greenhouse gas emissions, waste management, and energy transactions.
          </p>
        </div>
        <Button variant="primary" className="flex items-center space-x-1.5 w-fit">
          <Plus className="h-4 w-4" />
          <span>Add Carbon Entry</span>
        </Button>
      </div>

      {/* Grid for graphs */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Greenhouse Gas Emissions Trend (tCO2e)</CardTitle>
            <CardDescription>Historical compliance path compared to carbon-neutrality targets.</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={historicalEmission}
              xKey="year"
              dataKeys={['Emissions']}
              colors={['#10b981']}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emission Contributions</CardTitle>
            <CardDescription>Distribution of CO2 emissions by resource type.</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart
              data={emissionSources}
              colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444']}
            />
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Carbon Ledger Transactions</CardTitle>
          <CardDescription>Audit-trail log of recorded environmental indicators.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Activity Type</TableHead>
                <TableHead>Recorded Quantity</TableHead>
                <TableHead>CO2 Equivalent (t)</TableHead>
                <TableHead>Transaction Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium text-foreground">{tx.dept}</TableCell>
                  <TableCell>{tx.activity}</TableCell>
                  <TableCell>{tx.value} {tx.unit}</TableCell>
                  <TableCell className="font-semibold text-primary">{tx.co2} t</TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>
                    <Badge variant="success">Verified</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
export default Environmental;
