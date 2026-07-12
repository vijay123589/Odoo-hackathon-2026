import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Plus, Settings, Eye, Check } from 'lucide-react';

export const Reports: React.FC = () => {
  const reportsList = [
    { id: '1', name: 'Annual ESG Impact Report 2025', date: '2026-01-15', size: '4.8 MB', type: 'PDF' },
    { id: '2', name: 'Q1 Carbon Footprint Audit Booklet', date: '2026-04-10', size: '1.2 MB', type: 'XLSX' },
    { id: '3', name: 'CSR Social Contribution Ledger', date: '2026-06-22', size: '2.1 MB', type: 'PDF' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground/90">
            ESG Report Builder
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Assemble real-time carbon ledgers, CSR metrics, and governance indexes into regulatory disclosure booklets.
          </p>
        </div>
      </div>

      {/* Split Workspace Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Builder Controls (1 part) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-1">
            <CardHeader>
              <CardTitle>Report Parameters</CardTitle>
              <CardDescription>Configure framework and data scopes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Disclosure Framework</label>
                <div className="grid grid-cols-1 gap-2">
                  <button className="flex items-center justify-between p-3 rounded-xl border border-primary/20 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/8 transition-colors text-left">
                    <span>GRI Standards 2026</span>
                    <Check className="h-4 w-4 shrink-0" />
                  </button>
                  <button className="flex items-center justify-between p-3 rounded-xl border border-border/80 text-foreground/80 hover:bg-muted text-xs font-semibold transition-colors text-left">
                    <span>SASB Industry Disclosures</span>
                  </button>
                  <button className="flex items-center justify-between p-3 rounded-xl border border-border/80 text-foreground/80 hover:bg-muted text-xs font-semibold transition-colors text-left">
                    <span>TCFD Climate Report</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Included Ledger Scopes</label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary/30 h-4 w-4" />
                    <span className="font-semibold text-foreground/80">Scope 1 & 2 Emissions</span>
                  </label>
                  <label className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary/30 h-4 w-4" />
                    <span className="font-semibold text-foreground/80">Scope 3 Supply Chain</span>
                  </label>
                  <label className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary/30 h-4 w-4" />
                    <span className="font-semibold text-foreground/80">CSR Volunteering Ledger</span>
                  </label>
                </div>
              </div>

              <Button variant="primary" className="w-full mt-4 h-11 shadow-sm">
                <Plus className="h-4 w-4 mr-1.5" />
                <span>Generate Disclosure</span>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/10 border border-border/50">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Active Framework Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs pb-2.5 border-b border-border/20">
                <span className="font-bold text-foreground/80">GRI Disclosure Suite</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-center justify-between text-xs pb-2.5 border-b border-border/20">
                <span className="font-bold text-foreground/80">SASB Materiality</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground/80">EU CSRD Roadmap</span>
                <Badge variant="neutral">Drafting</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Premium Document Canvas Preview (2 parts) */}
        <div className="lg:col-span-2">
          <Card className="h-full bg-card min-h-[500px] flex flex-col shadow-[0_20px_50px_-12px_rgba(28,38,30,0.04)] border border-border/50">
            <div className="px-6 py-4 border-b border-border/55 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Live Workspace Preview</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  <Settings className="h-3.5 w-3.5 mr-1" />
                  <span>Customize Template</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  <span>Interactive Fullscreen</span>
                </Button>
              </div>
            </div>

            {/* Large Empty Workspace Canvas (Notion/Apple style mockup) */}
            <div className="flex-1 bg-[#FAF8F4]/40 dark:bg-[#0D100E]/20 p-8 flex items-center justify-center">
              <div className="w-full max-w-xl bg-card border border-border/50 rounded-2xl shadow-xl p-10 space-y-6 relative">
                {/* Visual mockup headers */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="primary" className="scale-90">Drafting</Badge>
                    <span className="text-[10px] text-muted-foreground font-semibold">GRI Disclosure v1.2</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-foreground/90 tracking-tight">Enterprise ESG Impact Booklet</h2>
                  <p className="text-xs text-muted-foreground/60">Report Cycle: FY2026 Q2 | Organization Scope: Global Operations</p>
                </div>
                
                <div className="border-t border-border/40 pt-6 space-y-4">
                  {/* Mock content blocks */}
                  <div className="space-y-1.5">
                    <div className="h-3 w-1/4 bg-muted rounded-md" />
                    <div className="h-2.5 w-full bg-muted/50 rounded" />
                    <div className="h-2.5 w-5/6 bg-muted/50 rounded" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="p-3 bg-muted/30 border border-border/30 rounded-xl space-y-1">
                      <span className="text-[9px] text-muted-foreground font-semibold uppercase">Total Carbon</span>
                      <p className="text-sm font-bold text-primary">84.6 t</p>
                    </div>
                    <div className="p-3 bg-muted/30 border border-border/30 rounded-xl space-y-1">
                      <span className="text-[9px] text-muted-foreground font-semibold uppercase">CSR Volunteer</span>
                      <p className="text-sm font-bold text-secondary">465 hrs</p>
                    </div>
                    <div className="p-3 bg-muted/30 border border-border/30 rounded-xl space-y-1">
                      <span className="text-[9px] text-muted-foreground font-semibold uppercase">Compliance Rate</span>
                      <p className="text-sm font-bold text-foreground">94.2%</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="h-3 w-1/3 bg-muted rounded-md" />
                    <div className="h-2.5 w-full bg-muted/50 rounded" />
                    <div className="h-2.5 w-2/3 bg-muted/50 rounded" />
                  </div>
                </div>

                <div className="absolute top-4 right-4 text-[10px] text-muted-foreground/30 font-bold select-none uppercase tracking-widest rotate-12">
                  EcoSphere Draft
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Completed Export History */}
      <Card>
        <CardHeader>
          <CardTitle>Compiled Export Archive</CardTitle>
          <CardDescription>Download previously generated audit booklets.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Report Name</TableHead>
                  <TableHead>File Type</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Generated Date</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportsList.map((rep) => (
                  <TableRow key={rep.id}>
                    <TableCell className="font-bold text-foreground/90 pl-6 flex items-center space-x-2.5">
                      <FileText className="h-4.5 w-4.5 text-muted-foreground/80" />
                      <span>{rep.name}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={rep.type === 'PDF' ? 'primary' : 'secondary'}>{rep.type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-semibold text-xs">{rep.size}</TableCell>
                    <TableCell className="text-muted-foreground">{rep.date}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="outline" size="sm" className="inline-flex items-center space-x-1.5">
                        <Download className="h-3.5 w-3.5" />
                        <span>Download</span>
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
export default Reports;
