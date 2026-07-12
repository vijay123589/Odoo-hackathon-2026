import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { RadarChart } from '../components/charts/RadarChart';
import { ShieldCheck, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Governance: React.FC = () => {
  const departmentScores = [
    { subject: 'Environmental', Engineering: 85, Sales: 65, Finance: 70 },
    { subject: 'Social', Engineering: 90, Sales: 85, Finance: 75 },
    { subject: 'Governance', Engineering: 95, Sales: 90, Finance: 90 },
    { subject: 'Energy Savings', Engineering: 80, Sales: 50, Finance: 60 },
    { subject: 'Diversity', Engineering: 88, Sales: 92, Finance: 80 },
  ];

  const policyLedger = [
    { id: '1', title: 'Anti-Bribery and Corruption Policy', category: 'Governance', version: 'v2.1', status: 'ACTIVE' },
    { id: '2', title: 'Supplier Code of Conduct', category: 'Governance', version: 'v1.4', status: 'ACTIVE' },
    { id: '3', title: 'Carbon Offset Policy Guidelines', category: 'Environmental', version: 'v1.0', status: 'DRAFT' },
  ];

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
            <ShieldCheck className="h-8 w-8 text-indigo-500 shrink-0" />
            <span>Governance (G) Standards</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage corporate integrity compliance, board diversity ratings, ESG audits, and policy approvals.
          </p>
        </div>
        <Button variant="primary" className="flex items-center space-x-1.5 w-fit">
          <Plus className="h-4 w-4" />
          <span>Upload Policy File</span>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Department Score Assessment</CardTitle>
            <CardDescription>Radar analysis comparing ESG metrics across Engineering, Sales, and Finance.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadarChart
              data={departmentScores}
              xKey="subject"
              dataKeys={['Engineering', 'Sales', 'Finance']}
              colors={['#10b981', '#3b82f6', '#f59e0b']}
            />
          </CardContent>
        </Card>

        {/* Audit summaries */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Summary Ledger</CardTitle>
            <CardDescription>Recent review certifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/65 border border-border rounded-xl flex items-start space-x-3.5">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold">Q2 ESG Internal Audit</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Passed with 96% score. No major non-conformances.</p>
              </div>
            </div>

            <div className="p-4 bg-muted/65 border border-border rounded-xl flex items-start space-x-3.5">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold">Scope 3 Emissions Review</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Pending supplier data collection audits.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Policies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Corporate Compliance Policies</CardTitle>
          <CardDescription>Manage active organizational policies and compliance standards.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policyLedger.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-semibold text-foreground">{policy.title}</TableCell>
                  <TableCell>{policy.category}</TableCell>
                  <TableCell>{policy.version}</TableCell>
                  <TableCell>
                    <Badge variant={policy.status === 'ACTIVE' ? 'success' : 'neutral'}>
                      {policy.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Open Document
                    </Button>
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
export default Governance;
