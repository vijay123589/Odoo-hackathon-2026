import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { RadarChart } from '@/components/charts/RadarChart';
import { ShieldCheck, Plus, CheckCircle, AlertTriangle, ArrowUpRight, Scale } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Minimalist Corporate Header */}
      <div className="relative rounded-3xl bg-premium-gradient border border-border/50 p-8 overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="space-y-2">
          <Badge variant="primary" className="bg-primary/10 text-primary border-primary/10">Corporate Governance</Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground/90 flex items-center space-x-2.5">
            <Scale className="h-8 w-8 text-primary shrink-0" />
            <span>Governance Operations</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            Ensure alignment with compliance frameworks, audit internal department scores, review regulatory risk exposures, and publish approved corporate policy guidelines.
          </p>
        </div>
        
        <Button variant="outline" className="flex items-center space-x-2 self-start md:self-auto h-11">
          <Plus className="h-4.5 w-4.5" />
          <span>Upload Policy File</span>
        </Button>
      </div>

      {/* Corporate Assessment & Audit summary grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Department ESG Score Analysis</CardTitle>
            <CardDescription>Radar assessment matrix evaluating ESG components across core corporate departments.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadarChart
              data={departmentScores}
              xKey="subject"
              dataKeys={['Engineering', 'Sales', 'Finance']}
            />
          </CardContent>
        </Card>

        {/* Audit summaries */}
        <Card className="bg-muted/10 border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-primary animate-pulse" />
              <span>ESG Compliance Ledger</span>
            </CardTitle>
            <CardDescription>Review audits and risk indicators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-card border border-border/40 rounded-xl flex items-start space-x-3.5 shadow-[0_2px_8px_rgba(28,38,30,0.01)]">
              <CheckCircle className="h-4.5 w-4.5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-foreground/80 leading-none mb-1">Q2 ESG Internal Audit</h4>
                <p className="text-[10px] text-muted-foreground leading-normal">Passed with 96% score. Verified by external auditor checks.</p>
              </div>
            </div>

            <div className="p-4 bg-card border border-border/40 rounded-xl flex items-start space-x-3.5 shadow-[0_2px_8px_rgba(28,38,30,0.01)]">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-foreground/80 leading-none mb-1">Scope 3 Supplier Review</h4>
                <p className="text-[10px] text-muted-foreground leading-normal">Compliance review pending for overseas supply chains.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Policies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Enterprise Compliance Policies</CardTitle>
          <CardDescription>Manage active organizational guidelines, board resolutions, and sustainability frameworks.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Policy Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policyLedger.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-bold text-foreground/90 pl-6">{policy.title}</TableCell>
                    <TableCell className="text-muted-foreground">{policy.category}</TableCell>
                    <TableCell className="font-semibold text-muted-foreground/80">{policy.version}</TableCell>
                    <TableCell>
                      <Badge variant={policy.status === 'ACTIVE' ? 'success' : 'neutral'}>
                        {policy.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="outline" size="sm" className="inline-flex items-center space-x-1">
                        <span>Open Doc</span>
                        <ArrowUpRight className="h-3 w-3 text-muted-foreground/60" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Governance;
