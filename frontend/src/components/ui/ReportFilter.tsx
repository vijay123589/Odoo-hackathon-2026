import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { Search, RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterState {
  search: string;
  department: string;
  employee: string;
  dateRange: string;
  esgCategory: string;
  challenge: string;
  module: string;
  status: string;
}

interface ReportFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  className?: string;
}

export const ReportFilter: React.FC<ReportFilterProps> = ({
  filters,
  onChange,
  onReset,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const handleFieldChange = (field: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  const departments = [
    { value: '', label: 'All Departments' },
    { value: 'Facilities', label: 'Facilities' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Executive Office', label: 'Executive Office' },
    { value: 'Human Resources', label: 'Human Resources' },
  ];

  const employees = [
    { value: '', label: 'All Employees' },
    { value: 'admin', label: 'Admin User' },
    { value: 'jane', label: 'Jane Doe' },
    { value: 'sarah', label: 'Sarah Jenkins' },
    { value: 'david', label: 'David Chen' },
  ];

  const dateRanges = [
    { value: '', label: 'All Time' },
    { value: 'Q1', label: 'Q1 (Jan - Mar)' },
    { value: 'Q2', label: 'Q2 (Apr - Jun)' },
    { value: 'H1', label: 'H1 (First Half)' },
    { value: 'FY2026', label: 'FY 2026' },
  ];

  const esgCategories = [
    { value: '', label: 'All Categories' },
    { value: 'Environmental', label: 'Environmental (E)' },
    { value: 'Social', label: 'Social (S)' },
    { value: 'Governance', label: 'Governance (G)' },
  ];

  const challenges = [
    { value: '', label: 'All Challenges' },
    { value: 'Zero Waste', label: 'Zero Waste Week' },
    { value: 'Cycle to Work', label: 'Cycle to Work July' },
    { value: 'Policy Certification', label: 'ESG Certification' },
  ];

  const modules = [
    { value: '', label: 'All Modules' },
    { value: 'Carbon', label: 'Carbon Ledger' },
    { value: 'Volunteering', label: 'CSR Volunteering' },
    { value: 'Compliance', label: 'Regulatory Audits' },
  ];

  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active / Pending' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'VERIFIED', label: 'Verified / Completed' },
  ];

  return (
    <Card className={`border border-border/50 shadow-sm ${className}`}>
      <CardHeader className="py-4 px-6 border-b border-border/40 flex flex-row items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-primary" />
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/80">Report Studio Filters</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center space-x-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search reports by title or descriptions..."
              value={filters.search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('search', e.target.value)}
              className="pl-9 h-10 bg-muted/20 border-border/60"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              label="ESG Category"
              value={filters.esgCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('esgCategory', e.target.value)}
              options={esgCategories}
            />

            <Select
              label="Department"
              value={filters.department}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('department', e.target.value)}
              options={departments}
            />

            <Select
              label="Date Range"
              value={filters.dateRange}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('dateRange', e.target.value)}
              options={dateRanges}
            />

            <Select
              label="Status"
              value={filters.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('status', e.target.value)}
              options={statuses}
            />

            <Select
              label="Associated Module"
              value={filters.module}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('module', e.target.value)}
              options={modules}
            />

            <Select
              label="Employee Owner"
              value={filters.employee}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('employee', e.target.value)}
              options={employees}
            />

            <Select
              label="Challenge Connection"
              value={filters.challenge}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('challenge', e.target.value)}
              options={challenges}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};
export default ReportFilter;
