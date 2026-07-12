import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BarChart } from '../components/charts/BarChart';
import { AreaChart } from '../components/charts/AreaChart';
import { Leaf, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  // Mock data for graphs
  const carbonTrends = [
    { name: 'Jan', Scope1: 45, Scope2: 32 },
    { name: 'Feb', Scope1: 52, Scope2: 29 },
    { name: 'Mar', Scope1: 49, Scope2: 36 },
    { name: 'Apr', Scope1: 38, Scope2: 25 },
    { name: 'May', Scope1: 41, Scope2: 22 },
    { name: 'Jun', Scope1: 33, Scope2: 19 },
  ];

  const volunteerParticipation = [
    { name: 'Q1', target: 200, actual: 185 },
    { name: 'Q2', target: 250, actual: 280 },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ESG Command Center</h1>
          <p className="text-sm text-muted-foreground">
            EcoSphere ESG Management platform overview and operations dashboard.
          </p>
        </div>
        <Badge variant="primary" className="w-fit">
          Live Compliance Status: 94.2%
        </Badge>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: CO2 Emissions */}
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Carbon Footprint
              </p>
              <h3 className="text-2xl font-bold mt-0.5">84.6 tCO2e</h3>
              <p className="text-xs text-green-600 dark:text-green-400 mt-0.5 font-medium">
                -12.4% vs last quarter
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Employee Volunteer hours */}
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                CSR Volunteering
              </p>
              <h3 className="text-2xl font-bold mt-0.5">465 Hours</h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 font-medium">
                +18.2% vs last quarter
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: active audits */}
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Active Audits
              </p>
              <h3 className="text-2xl font-bold mt-0.5">3 Pending</h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 font-medium">
                1 Audit starting tomorrow
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Policies Resolved */}
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Active Policies
              </p>
              <h3 className="text-2xl font-bold mt-0.5">14 Policies</h3>
              <p className="text-xs text-primary mt-0.5 font-medium">
                100% Employee Attended
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Carbon Emissions Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={carbonTrends}
              xKey="name"
              dataKeys={['Scope1', 'Scope2']}
              colors={['#10b981', '#3b82f6']}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSR Participation Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={volunteerParticipation}
              xKey="name"
              dataKeys={['target', 'actual']}
              colors={['#94a3b8', '#10b981']}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;
