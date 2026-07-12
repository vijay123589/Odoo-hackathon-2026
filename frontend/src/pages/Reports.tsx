import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { FileSpreadsheet, Download, FileText, Calendar } from 'lucide-react';

export const Reports: React.FC = () => {
  const reportsList = [
    { id: '1', name: 'Annual ESG Impact Report 2025', date: '2026-01-15', size: '4.8 MB', type: 'PDF' },
    { id: '2', name: 'Q1 Carbon Footprint Audit Audit', date: '2026-04-10', size: '1.2 MB', type: 'XLSX' },
    { id: '3', name: 'CSR Social Contribution Audit', date: '2026-06-22', size: '2.1 MB', type: 'PDF' },
  ];

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
            <FileSpreadsheet className="h-8 w-8 text-amber-500 shrink-0" />
            <span>Sustainability Reports</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Generate and export audit-ready ESG impact booklets, emission disclosures, and volunteering reports.
          </p>
        </div>
      </div>

      {/* Grid for report builder */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Report Compilation Center</CardTitle>
            <CardDescription>Assemble real-time data into standard regulatory frameworks (GRI, SASB, TCFD).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 border border-border rounded-xl hover:border-primary/50 transition-colors cursor-pointer space-y-2.5">
                <FileText className="h-8 w-8 text-primary" />
                <h4 className="font-semibold text-sm">GRI Standard Summary</h4>
                <p className="text-xs text-muted-foreground">
                  Global Reporting Initiative framework compiling carbon disclosures and governance metrics.
                </p>
              </div>

              <div className="p-4 border border-border rounded-xl hover:border-primary/50 transition-colors cursor-pointer space-y-2.5">
                <FileSpreadsheet className="h-8 w-8 text-blue-500" />
                <h4 className="font-semibold text-sm">Carbon Ledger (Scope 1-3)</h4>
                <p className="text-xs text-muted-foreground">
                  Raw carbon ledger entries exported in XLSX format for third-party auditing.
                </p>
              </div>
            </div>

            <Button variant="primary">Generate Custom Disclosure Report</Button>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Frameworks</CardTitle>
            <CardDescription>Regulatory guidelines supported by EcoSphere.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-sm font-semibold">GRI Standards</span>
              <Badge variant="success">Supported</Badge>
            </div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-sm font-semibold">SASB Metrics</span>
              <Badge variant="success">Supported</Badge>
            </div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-sm font-semibold">TCFD Disclosures</span>
              <Badge variant="success">Supported</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">CSRD (EU)</span>
              <Badge variant="warning">Draft Mode</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table listing historical reports */}
      <Card>
        <CardHeader>
          <CardTitle>Compiled Export History</CardTitle>
          <CardDescription>Download previously generated static archives.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>File Type</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Generated Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportsList.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell className="font-medium text-foreground flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{rep.name}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={rep.type === 'PDF' ? 'primary' : 'secondary'}>{rep.type}</Badge>
                  </TableCell>
                  <TableCell>{rep.size}</TableCell>
                  <TableCell>{rep.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="inline-flex items-center space-x-1.5">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
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
export default Reports;
