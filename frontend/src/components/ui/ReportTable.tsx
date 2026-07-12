import React, { useState, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './Table';
import { Button } from './Button';
import { Input } from './Input';
import { Skeleton } from './Skeleton';
import { Search, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight, EyeOff, Check, X } from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface ReportTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  initialRowsPerPage?: number;
  isLoading?: boolean;
}

export function ReportTable<T extends { id: string | number; [key: string]: any }>({
  data,
  columns,
  searchPlaceholder = 'Quick search rows...',
  searchKey,
  initialRowsPerPage = 5,
  isLoading = false,
}: ReportTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(initialRowsPerPage);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    const config: Record<string, boolean> = {};
    columns.forEach((col) => {
      config[col.key] = true;
    });
    return config;
  });
  const [showColMenu, setShowColMenu] = useState(false);

  // Column Visibility
  const activeColumns = useMemo(() => {
    return columns.filter((col) => visibleColumns[col.key]);
  }, [columns, visibleColumns]);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Internal Sorting
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Filter & Search
  const filteredData = useMemo(() => {
    let result = [...data];

    // Local Search
    if (searchQuery.trim() && searchKey) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) => {
        const value = row[searchKey];
        return value ? String(value).toLowerCase().includes(query) : false;
      });
    }

    // Local Sort
    if (sortKey) {
      result.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
        if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, searchKey, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {searchKey ? (
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9 text-xs border-border/60 bg-muted/10 focus:bg-card"
            />
          </div>
        ) : (
          <div />
        )}

        {/* Column Visibility Selector */}
        <div className="relative self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColMenu(!showColMenu)}
            className="h-9 px-3 text-xs font-semibold inline-flex items-center space-x-1.5"
          >
            <EyeOff className="h-3.5 w-3.5" />
            <span>Columns</span>
            <ChevronDown className="h-3 w-3" />
          </Button>

          {showColMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border shadow-premium rounded-xl p-2 z-50 animate-in fade-in duration-200">
              <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest p-1.5 border-b border-border/30">
                Toggle Columns
              </div>
              <div className="space-y-0.5 mt-1">
                {columns.map((col) => (
                  <button
                    key={col.key}
                    onClick={() => toggleColumn(col.key)}
                    className="flex items-center justify-between w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-muted text-foreground/80"
                  >
                    <span>{col.header}</span>
                    {visibleColumns[col.key] ? (
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="border border-border/50 rounded-2xl overflow-hidden bg-card shadow-[0_4px_24px_-8px_rgba(28,38,30,0.01)] relative">
        <div className="overflow-x-auto max-h-[400px]">
          <Table className="w-full border-collapse">
            <TableHeader className="sticky top-0 bg-card border-b border-border/60 z-10">
              <TableRow>
                {activeColumns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={`text-xs font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 ${
                      col.sortable ? 'cursor-pointer select-none hover:text-foreground' : ''
                    }`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <ArrowUpDown
                          className={`h-3 w-3 shrink-0 ${
                            sortKey === col.key ? 'text-primary' : 'text-muted-foreground/40'
                          }`}
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeletons for Loading State
                Array.from({ length: rowsPerPage }).map((_, rIdx) => (
                  <TableRow key={rIdx}>
                    {activeColumns.map((_, cIdx) => (
                      <TableCell key={cIdx} className="py-4 px-4">
                        <Skeleton className="h-4 w-5/6 rounded-md bg-muted/60" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                    {activeColumns.map((col) => (
                      <TableCell key={col.key} className="py-3.5 px-4 text-xs font-medium text-foreground/80">
                        {col.render ? col.render(row) : row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                // Empty State
                <TableRow>
                  <TableCell colSpan={activeColumns.length} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <X className="h-5 w-5" />
                      </div>
                      <h4 className="text-xs font-bold text-foreground/80 uppercase tracking-wider">No matching records</h4>
                      <p className="text-xs text-muted-foreground">Try clearing filters or search keywords.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && !isLoading && (
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-muted-foreground font-semibold">
            Showing Page {currentPage} of {totalPages} ({filteredData.length} entries total)
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="h-8 w-8 p-0 flex items-center justify-center rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="h-8 w-8 p-0 flex items-center justify-center rounded-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
export default ReportTable;
