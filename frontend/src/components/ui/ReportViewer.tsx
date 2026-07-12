import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { AnalyticsCard } from './AnalyticsCard';
import { ChartSection } from './ChartSection';
import { ReportTable, ColumnDef } from './ReportTable';
import { ArrowLeft, Download, Pin, Sparkles, AlertCircle } from 'lucide-react';

interface ReportViewerProps {
  report: {
    id: string;
    name: string;
    category: string;
    description: string;
    date: string;
    isPinned?: boolean;
  };
  onBack: () => void;
  onExport: (name: string) => void;
  className?: string;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  report,
  onBack,
  onExport,
  className = '',
}) => {
  // Config data based on Category
  const isEnv = report.category.toLowerCase() === 'environmental';
  const isSoc = report.category.toLowerCase() === 'social';

  // KPI calculations
  const kpis = isEnv
    ? [
        { title: 'Gross Emissions', value: '84.6 tCO2e', desc: '12.4% reduction', trend: 'up' as const },
        { title: 'Carbon Offset', value: '25.0 tCO2e', desc: 'Targeting 30.0 t', trend: 'neutral' as const },
        { title: 'Energy Index', value: '92.4%', desc: 'Renewable share', trend: 'up' as const },
      ]
    : isSoc
    ? [
        { title: 'CSR Contribution', value: '465 Hours', desc: '18.2% increase', trend: 'up' as const },
        { title: 'Volunteers Engaged', value: '184 Staff', desc: '76.4% total rate', trend: 'up' as const },
        { title: 'Award Badges', value: '148 Issued', desc: '3 active challenges', trend: 'neutral' as const },
      ]
    : [
        { title: 'Audit Score', value: '96.2%', desc: 'Verified by third-party', trend: 'up' as const },
        { title: 'Active Policies', value: '14 Signed', desc: '100% attendance rate', trend: 'up' as const },
        { title: 'Pending Audits', value: '3 Reviews', desc: 'Scope 3 reviews scheduled', trend: 'down' as const },
      ];

  // Table columns definition
  interface ReportRow {
    id: string;
    scope: string;
    value: string;
    date: string;
    status: string;
  }
  
  const tableColumns: ColumnDef<ReportRow>[] = [
    { key: 'scope', header: 'Resource scope / category', sortable: true },
    { key: 'value', header: 'Recorded Quantity', sortable: true },
    { key: 'date', header: 'Log timestamp', sortable: true },
    {
      key: 'status',
      header: 'Audit Status',
      render: (row) => (
        <Badge variant={row.status === 'VERIFIED' ? 'success' : 'neutral'} className="scale-90">
          {row.status}
        </Badge>
      ),
    },
  ];

  const tableData: ReportRow[] = isEnv
    ? [
        { id: '1', scope: 'Scope 1 - Diesel Generators', value: '14.2 tCO2e', date: '2026-07-10', status: 'VERIFIED' },
        { id: '2', scope: 'Scope 2 - Grid Electricity', value: '38.4 tCO2e', date: '2026-07-09', status: 'VERIFIED' },
        { id: '3', scope: 'Scope 3 - Employee Commuting', value: '32.0 tCO2e', date: '2026-07-08', status: 'VERIFIED' },
        { id: '4', scope: 'Scope 1 - Facility Gas Burners', value: '12.1 tCO2e', date: '2026-07-05', status: 'DRAFT' },
      ]
    : isSoc
    ? [
        { id: '1', scope: 'Volunteer - Local Tree Planting', value: '180 Hours', date: '2026-07-08', status: 'VERIFIED' },
        { id: '2', scope: 'Training - ESG Inclusion Seminars', value: '145 Hours', date: '2026-07-04', status: 'VERIFIED' },
        { id: '3', scope: 'Volunteer - Community Food Drive', value: '140 Hours', date: '2026-06-30', status: 'VERIFIED' },
      ]
    : [
        { id: '1', scope: 'Policy - Supplier Code of Conduct', value: 'Signed v1.4', date: '2026-07-01', status: 'VERIFIED' },
        { id: '2', scope: 'Policy - Anti-Corruption Pledge', value: 'Signed v2.1', date: '2026-06-18', status: 'VERIFIED' },
        { id: '3', scope: 'Audit - Carbon Offset Ledger v1.0', value: 'Pending Review', date: '2026-06-10', status: 'DRAFT' },
      ];

  const insights = isEnv
    ? [
        'Grid electricity accounts for 54% of Scope 2 metrics. Powering down office systems post-18:00 could lower monthly Scope 2 aggregates by 15%.',
        'Scope 3 logistics flights showed a 12% rise over Q1. Shift short-distance executive travels to high-speed rail to maintain net-zero pathways.',
      ]
    : isSoc
    ? [
        'Volunteering rates reached an all-time high of 76.4% due to the zero-waste challenges. Highly engaged departments: Engineering & Sales.',
        'Policy training feedback shows 95% satisfaction. Diversity seminars should extend to external contractors in Q3.',
      ]
    : [
        'Internal ESG compliance is rated at AAA level. Minor gaps in supplier data availability are being solved via external audit drafts.',
        'Cryptographic audit trails are fully active for Scope 1 ledger logs. No unauthorized modifications detected.',
      ];

  return (
    <div className={`space-y-8 max-w-7xl mx-auto ${className}`}>
      {/* Viewer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-4 border-b border-border/40">
        <div className="flex items-center space-x-3.5 min-w-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-9 w-9 p-0 flex items-center justify-center rounded-xl"
            title="Return to Reports"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  report.category.toLowerCase() === 'environmental'
                    ? 'success'
                    : report.category.toLowerCase() === 'social'
                    ? 'secondary'
                    : 'primary'
                }
              >
                {report.category}
              </Badge>
              <span className="text-[10px] text-muted-foreground font-semibold">FY2026 Target Standard</span>
            </div>
            <h2 className="text-xl font-extrabold text-foreground/90 truncate mt-1">
              {report.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-3 text-xs font-semibold inline-flex items-center space-x-1.5"
            title="Pin Document"
          >
            <Pin className={`h-4 w-4 ${report.isPinned ? 'text-primary fill-current' : 'text-muted-foreground/60'}`} />
            <span>{report.isPinned ? 'Pinned' : 'Pin'}</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => onExport(report.name)}
            className="h-10 px-3.5 text-xs font-bold inline-flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export & Share</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {kpis.map((kpi) => (
          <AnalyticsCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            description={kpi.desc}
            trend={{ value: kpi.trend === 'up' ? 'Positive' : kpi.trend === 'down' ? 'Needs Check' : 'Stable', direction: kpi.trend }}
          />
        ))}
      </div>

      {/* Charts Visualization Card */}
      <ChartSection reportName={report.name} category={report.category} />

      {/* Split details view: Data table + AI Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Analytics Ledger (2 parts) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="py-4 px-6 border-b border-border/40">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/80">Detailed Ledger Log</CardTitle>
              <CardDescription className="text-[10px] font-semibold text-muted-foreground/70">Audit trails and category entries verified under current framework.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ReportTable
                data={tableData}
                columns={tableColumns}
                searchKey="scope"
                searchPlaceholder="Filter items by scope..."
                initialRowsPerPage={5}
              />
            </CardContent>
          </Card>
        </div>

        {/* AI Compliance Recommendations (1 part) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-primary/5 dark:bg-primary/[0.02] border border-primary/10 p-1">
            <CardHeader className="py-4 px-6">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 animate-pulse shrink-0" />
                <span>AI Compliance Analytics</span>
              </CardTitle>
              <CardDescription className="text-[9px] font-semibold text-primary/60">Automated insights based on active reports database.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {insights.map((insight, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 p-3 bg-card border border-border/40 rounded-xl shadow-[0_2px_8px_rgba(28,38,30,0.005)]">
                  <AlertCircle className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] font-semibold text-muted-foreground/90 leading-relaxed">
                    {insight}
                  </p>
                </div>
              ))}
            </CardContent>
            <CardFooter className="pt-0 pb-4 px-6 flex justify-end">
              <span className="text-[9px] text-primary/60 font-bold uppercase tracking-wider">Copilot v1.5 Verified</span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default ReportViewer;
