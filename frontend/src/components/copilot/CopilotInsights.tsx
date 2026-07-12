import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AlertTriangle, ShieldCheck, Target, Clock, ArrowUpRight, BarChart2, Award, FileText } from 'lucide-react';

interface CopilotInsightsProps {
  onQuickAction: (actionKey: string) => void;
  className?: string;
}

export const CopilotInsights: React.FC<CopilotInsightsProps> = ({
  onQuickAction,
  className = '',
}) => {
  const recommendedActions = [
    { text: 'Verify Logistics fuel audits', priority: 'High', type: 'compliance' },
    { text: 'Draft GRI carbon offset index', priority: 'Medium', type: 'report' },
    { text: 'Schedule Q3 diversity seminars', priority: 'Low', type: 'csr' },
  ];

  const deadlines = [
    { task: 'Scope 3 Supply Chain Audit', date: 'Jul 20, 2026', days: 8 },
    { task: 'CSR volunteering reports upload', date: 'Jul 24, 2026', days: 12 },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ESG Dashboard Quick Gauge */}
      <Card className="border border-border/50 shadow-sm p-5 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
            Intelligence Console
          </span>
          <Badge variant="success">AAA Rating</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/30 border border-border/40 rounded-xl space-y-1.5">
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider flex items-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Compliance</span>
            </span>
            <p className="text-lg font-bold text-foreground">96.2%</p>
          </div>
          <div className="p-3 bg-muted/30 border border-border/40 rounded-xl space-y-1.5">
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider flex items-center space-x-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span>Risk Level</span>
            </span>
            <p className="text-lg font-bold text-foreground">Low</p>
          </div>
          <div className="p-3 bg-muted/30 border border-border/40 rounded-xl space-y-1.5 col-span-2">
            <div className="flex justify-between items-center text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
              <span>Carbon Trend Offset</span>
              <span className="text-primary font-bold">-12.4% vs Q1</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-primary rounded-full" style={{ width: '78%' }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Recommended Actions */}
      <Card className="border border-border/50 shadow-sm p-1">
        <CardHeader className="py-4 px-5">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center space-x-1.5">
            <Target className="h-4 w-4 text-primary shrink-0" />
            <span>Recommended Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-5 pb-4 pt-0">
          {recommendedActions.map((action, idx) => (
            <div
              key={idx}
              className="flex justify-between items-start p-2.5 bg-muted/20 border border-border/30 rounded-lg text-xs hover:border-primary/10 transition-colors"
            >
              <span className="font-semibold text-muted-foreground/90 leading-tight">
                {action.text}
              </span>
              <Badge
                variant={
                  action.priority === 'High'
                    ? 'neutral' // default to grey/red badge variant mappings
                    : 'neutral'
                }
                className="scale-90 px-1 py-0"
              >
                {action.priority}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Deadlines Checklist */}
      <Card className="border border-border/50 shadow-sm p-1">
        <CardHeader className="py-4 px-5">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center space-x-1.5">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <span>Upcoming Deadlines</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-5 pb-4 pt-0">
          {deadlines.map((dl, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-foreground/85 leading-tight">{dl.task}</p>
                <span className="text-[10px] text-muted-foreground font-semibold">{dl.date}</span>
              </div>
              <Badge variant="primary" className="scale-90">
                {dl.days} days
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions Console */}
      <Card className="border border-border/50 shadow-sm p-1">
        <CardHeader className="py-4 px-5">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground/80">
            Navigation Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-5 pb-4 pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickAction('dashboard')}
            className="w-full h-9 text-xs font-bold inline-flex items-center justify-between border-border/50"
          >
            <span className="flex items-center space-x-2">
              <BarChart2 className="h-3.5 w-3.5 text-primary" />
              <span>ESG Dashboard</span>
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickAction('reports')}
            className="w-full h-9 text-xs font-bold inline-flex items-center justify-between border-border/50"
          >
            <span className="flex items-center space-x-2">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span>ESG Reports Module</span>
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickAction('environmental')}
            className="w-full h-9 text-xs font-bold inline-flex items-center justify-between border-border/50"
          >
            <span className="flex items-center space-x-2">
              <Award className="h-3.5 w-3.5 text-primary" />
              <span>Carbon Ledger</span>
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default CopilotInsights;
