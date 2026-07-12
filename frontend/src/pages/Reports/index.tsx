import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ReportCard } from '@/components/ui/ReportCard';
import { ReportFilter, FilterState } from '@/components/ui/ReportFilter';
import { ReportTable, ColumnDef } from '@/components/ui/ReportTable';
import { ExportDialog } from '@/components/ui/ExportDialog';
import { ReportViewer } from '@/components/ui/ReportViewer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  FileText,
  Plus,
  Search,
  SlidersHorizontal,
  Bookmark,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

type ViewState = 'landing' | 'builder' | 'details';

export const Reports: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [exportTarget, setExportTarget] = useState<{ id: string; name: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Builder state
  const [builderFilters, setBuilderFilters] = useState<FilterState>({
    search: '',
    department: '',
    employee: '',
    dateRange: '',
    esgCategory: '',
    challenge: '',
    module: '',
    status: '',
  });

  // Base mock reports list
  const [reportsList, setReportsList] = useState([
    {
      id: 'rep-1',
      name: 'Annual ESG Impact Report 2025',
      category: 'Governance',
      description: 'Comprehensive compliance and audit indicators summarizing governance scores and regulatory policy logs.',
      date: '2026-01-15',
      isPinned: true,
    },
    {
      id: 'rep-2',
      name: 'Q1 Carbon Footprint Audit Booklet',
      category: 'Environmental',
      description: 'Carbon emissions calculations, Scope 1 and 2 electricity ledgers, and logistics fuel details.',
      date: '2026-04-10',
      isPinned: true,
    },
    {
      id: 'rep-3',
      name: 'CSR Social Contribution Ledger',
      category: 'Social',
      description: 'Staff volunteering hours audit sheets, zero-waste challenges, and community outreach campaigns.',
      date: '2026-06-22',
      isPinned: false,
    },
    {
      id: 'rep-4',
      name: 'Department ESG Performance Matrix',
      category: 'Governance',
      description: 'Comparison of carbon footprints and compliance checklists across Engineering, Sales, and Finance.',
      date: '2026-07-01',
      isPinned: false,
    },
    {
      id: 'rep-5',
      name: 'Scope 3 Supply Chain Disclosure',
      category: 'Environmental',
      description: 'Upstream and downstream supplier carbon ledger reviews and shipping fuels auditing reports.',
      date: '2026-07-05',
      isPinned: false,
    },
    {
      id: 'rep-6',
      name: 'Employee Challenge Leaderboard Q2',
      category: 'Social',
      description: 'Volunteering hours rankings, earned badges audit, and points redeemed for active corporate challenges.',
      date: '2026-07-08',
      isPinned: false,
    },
  ]);

  // Export ledger exports list
  const exportHistoryList = [
    { id: '1', name: 'Annual ESG Impact Report 2025.pdf', type: 'PDF', size: '4.8 MB', date: '2026-01-15' },
    { id: '2', name: 'Q1 Carbon Footprint Audit Booklet.xlsx', type: 'XLSX', size: '1.2 MB', date: '2026-04-10' },
    { id: '3', name: 'CSR Social Contribution Ledger.pdf', type: 'PDF', size: '2.1 MB', date: '2026-06-22' },
  ];

  const exportHistoryColumns: ColumnDef<any>[] = [
    { key: 'name', header: 'Export Filename', sortable: true },
    {
      key: 'type',
      header: 'Format',
      render: (row) => (
        <Badge variant={row.type === 'PDF' ? 'primary' : 'secondary'} className="scale-90">
          {row.type}
        </Badge>
      ),
      sortable: true,
    },
    { key: 'size', header: 'File Size' },
    { key: 'date', header: 'Export Timestamp', sortable: true },
    {
      key: 'actions',
      header: 'Download',
      render: () => (
        <Button variant="outline" size="sm" className="h-8 px-2 text-xs font-bold inline-flex items-center space-x-1">
          <Download className="h-3.5 w-3.5" />
          <span>Retrieve</span>
        </Button>
      ),
    },
  ];

  // Category tags
  const categories = ['All', 'Environmental', 'Social', 'Governance'];

  // Pinned reports filtered list
  const pinnedReports = useMemo(() => {
    return reportsList.filter((r) => r.isPinned);
  }, [reportsList]);

  // Filtered reports for landing
  const filteredReports = useMemo(() => {
    return reportsList.filter((r) => {
      const matchCat = activeCategory === 'All' || r.category === activeCategory;
      const matchSearch =
        !globalSearch ||
        r.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        r.description.toLowerCase().includes(globalSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [reportsList, activeCategory, globalSearch]);

  // Dynamic preview search details inside Report Builder
  const builderPreviewData = useMemo(() => {
    const isEnv = builderFilters.esgCategory.toLowerCase() === 'environmental';
    const isSoc = builderFilters.esgCategory.toLowerCase() === 'social';

    if (isEnv) {
      return [
        { id: '1', dept: 'Facilities', activity: 'Scope 2 Electricity', quantity: '4,500 kWh', co2: '1.84 t' },
        { id: '2', dept: 'Logistics', activity: 'Scope 1 Diesel fuel', quantity: '350 Liters', co2: '0.92 t' },
      ];
    } else if (isSoc) {
      return [
        { id: '1', dept: 'Engineering', activity: 'CSR Tree Planting', quantity: '42 Hours', co2: 'Social Impact' },
        { id: '2', dept: 'Finance', activity: 'Inclusion Training', quantity: '12 Hours', co2: 'Diversity' },
      ];
    }
    return [
      { id: '1', dept: 'Corporate Board', activity: 'Audit Policy Review', quantity: 'Approved', co2: 'GRI Compliance' },
      { id: '2', dept: 'HR Dept', activity: 'Access Rules Stamp', quantity: 'Strict Logs', co2: 'Governance' },
    ];
  }, [builderFilters]);

  const builderPreviewColumns: ColumnDef<any>[] = [
    { key: 'dept', header: 'Department', sortable: true },
    { key: 'activity', header: 'Action Activity', sortable: true },
    { key: 'quantity', header: 'Metrics Quantity', sortable: true },
    { key: 'co2', header: 'Verification Scope', sortable: true },
  ];

  // Report execution view selection
  const selectedReport = useMemo(() => {
    return reportsList.find((r) => r.id === selectedReportId) || reportsList[0];
  }, [reportsList, selectedReportId]);

  // Launch mock report build
  const handleLaunchBuild = () => {
    const newId = `rep-${reportsList.length + 1}`;
    const name = `${builderFilters.esgCategory || 'ESG'} Compliance Summary ${new Date().getFullYear()}`;
    const newReport = {
      id: newId,
      name,
      category: builderFilters.esgCategory || 'Environmental',
      description: `Custom generated report compilation reviewing ${builderFilters.department || 'all'} departments under scope.`,
      date: new Date().toISOString().split('T')[0],
      isPinned: false,
    };

    setReportsList([newReport, ...reportsList]);
    setSelectedReportId(newId);
    setView('details');
  };

  const handleOpenExport = (id: string, name: string) => {
    setExportTarget({ id, name });
  };

  return (
    <div className="space-y-8">
      {/* Root Layout View Controller */}
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground/90">
                  Analytics & Reports Workspace
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Access compiled ESG disclosures, manage regulatory booklets, or design custom reporting matrices.
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setView('builder')}
                  className="h-11 px-4 text-xs font-bold inline-flex items-center space-x-1.5 shadow-sm"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Launch Report Studio</span>
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setBuilderFilters({
                      search: '',
                      department: '',
                      employee: '',
                      dateRange: 'Q2',
                      esgCategory: 'Environmental',
                      challenge: '',
                      module: '',
                      status: 'ACTIVE',
                    });
                    setView('builder');
                  }}
                  className="h-11 px-4.5 text-xs font-bold inline-flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Create Custom Report</span>
                </Button>
              </div>
            </div>

            {/* Global search experience with suggestions */}
            <Card className="p-5 border border-border/50 shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground/60" />
                  <input
                    type="text"
                    placeholder="Global search folders, regulatory frameworks (GRI, TCFD), or historical booklets..."
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-muted/30 focus:bg-card border border-border/60 rounded-xl text-xs font-semibold focus:outline-none transition-colors duration-200"
                  />
                </div>
                {globalSearch && (
                  <Button variant="ghost" size="sm" onClick={() => setGlobalSearch('')} className="h-9 px-3 text-xs">
                    Clear Query
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3.5 text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider">
                <span>Suggested lookups:</span>
                <button onClick={() => setGlobalSearch('Carbon')} className="px-2.5 py-1 bg-muted rounded-md hover:bg-primary/5 hover:text-primary border border-border/40 transition-colors">Scope 1 & 2 Emissions</button>
                <button onClick={() => setGlobalSearch('CSR')} className="px-2.5 py-1 bg-muted rounded-md hover:bg-primary/5 hover:text-primary border border-border/40 transition-colors">Volunteering Logs</button>
                <button onClick={() => setGlobalSearch('Annual')} className="px-2.5 py-1 bg-muted rounded-md hover:bg-primary/5 hover:text-primary border border-border/40 transition-colors">Annual GRI Disclosure</button>
              </div>
            </Card>

            {/* Pinned Reports section */}
            {pinnedReports.length > 0 && !globalSearch && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Bookmark className="h-4.5 w-4.5 text-primary" />
                  <h3 className="text-xs font-extrabold text-foreground/85 uppercase tracking-wider">Pinned Disclosures</h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pinnedReports.map((rep) => (
                    <ReportCard
                      key={rep.id}
                      id={rep.id}
                      name={rep.name}
                      category={rep.category}
                      description={rep.description}
                      date={rep.date}
                      isPinned={rep.isPinned}
                      onView={(id) => {
                        setSelectedReportId(id);
                        setView('details');
                      }}
                      onExport={(id) => handleOpenExport(id, rep.name)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Saved Reports Hub (Tabbed Categories) */}
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3 gap-3">
                <h3 className="text-xs font-extrabold text-foreground/85 uppercase tracking-wider">Disclosure Catalog</h3>
                <div className="flex items-center space-x-1 overflow-x-auto p-0.5 bg-muted/65 rounded-xl border border-border/10">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-colors shrink-0 ${
                        activeCategory === cat
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {filteredReports.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-200">
                  {filteredReports.map((rep) => (
                    <ReportCard
                      key={rep.id}
                      id={rep.id}
                      name={rep.name}
                      category={rep.category}
                      description={rep.description}
                      date={rep.date}
                      isPinned={rep.isPinned}
                      onView={(id) => {
                        setSelectedReportId(id);
                        setView('details');
                      }}
                      onExport={(id) => handleOpenExport(id, rep.name)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card border border-border/50 rounded-2xl flex flex-col items-center justify-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground/60 shadow-sm">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-foreground/80 uppercase tracking-widest">No matching report booklets</h4>
                  <p className="text-xs text-muted-foreground max-w-sm px-6">
                    Try searching other keywords or choose a different category tab.
                  </p>
                </div>
              )}
            </div>

            {/* Compiled Export Archive */}
            <Card className="border border-border/50 shadow-sm">
              <CardHeader className="py-4 px-6 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/85">Export Vault History</CardTitle>
                <CardDescription className="text-[10px] font-semibold text-muted-foreground/70">Secure static exports compiled under regulatory standards.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ReportTable
                  data={exportHistoryList}
                  columns={exportHistoryColumns}
                  searchKey="name"
                  searchPlaceholder="Filter archives by filename..."
                  initialRowsPerPage={3}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {view === 'builder' && (
          <motion.div
            key="builder"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Studio Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/40 shrink-0">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground/90">
                  Custom Report Builder Studio
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Adjust visual criteria filters to extract matching entries from the live database.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView('landing')}
                className="h-10 px-3.5 text-xs font-bold"
              >
                Close Studio
              </Button>
            </div>

            {/* Filters panel */}
            <ReportFilter
              filters={builderFilters}
              onChange={setBuilderFilters}
              onReset={() =>
                setBuilderFilters({
                  search: '',
                  department: '',
                  employee: '',
                  dateRange: '',
                  esgCategory: '',
                  challenge: '',
                  module: '',
                  status: '',
                })
              }
            />

            {/* Preview Section */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Studio Canvas (2 parts) */}
              <Card className="lg:col-span-2 shadow-sm border border-border/50 flex flex-col min-h-[400px]">
                <div className="px-6 py-4 border-b border-border/45 flex justify-between items-center bg-card">
                  <div className="flex items-center space-x-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Studio Canvas Preview</span>
                  </div>
                  <Badge variant="primary" className="scale-90">Live Extract</Badge>
                </div>
                
                <div className="flex-1 p-6 space-y-6">
                  {/* Matching Rows Database */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Extracted Database Rows</span>
                    <ReportTable
                      data={builderPreviewData}
                      columns={builderPreviewColumns}
                      initialRowsPerPage={3}
                    />
                  </div>
                </div>
              </Card>

              {/* Action Box Summary (1 part) */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-muted/10 border border-border/60 h-full flex flex-col justify-between p-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold text-foreground/80 uppercase tracking-widest flex items-center space-x-1.5">
                      <Sparkles className="h-4.5 w-4.5 text-primary shrink-0" />
                      <span>Studio Compilation</span>
                    </h3>
                    
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between border-b border-border/20 pb-2">
                        <span className="text-muted-foreground font-semibold">ESG Domain</span>
                        <span className="font-bold text-foreground">{builderFilters.esgCategory || 'Unassigned'}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/20 pb-2">
                        <span className="text-muted-foreground font-semibold">Filter Scope</span>
                        <span className="font-bold text-foreground">{builderFilters.department || 'All Departments'}</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="text-muted-foreground font-semibold">Audit Window</span>
                        <span className="font-bold text-foreground">{builderFilters.dateRange || 'All Time'}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl text-[11px] text-muted-foreground font-semibold leading-relaxed">
                      Custom builds assemble grid records dynamically into standard GRI/SASB report formats.
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleLaunchBuild}
                    className="w-full mt-6 h-11 shadow-sm font-bold"
                  >
                    <span>Compile & Execute Report</span>
                    <ChevronRight className="h-4 w-4 ml-1 shrink-0" />
                  </Button>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <ReportViewer
              report={selectedReport}
              onBack={() => setView('landing')}
              onExport={(name) => handleOpenExport(selectedReportId || '', name)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reusable Export Modal */}
      {exportTarget && (
        <ExportDialog
          isOpen={exportTarget !== null}
          onClose={() => setExportTarget(null)}
          reportName={exportTarget.name}
        />
      )}
    </div>
  );
};
export default Reports;

