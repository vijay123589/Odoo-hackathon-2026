import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BarChart } from '@/components/charts/BarChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { Leaf, Users, ShieldAlert, CheckCircle2, Award, Calendar, ArrowUpRight, TrendingDown } from 'lucide-react';

export const Dashboard: React.FC = () => {
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

  const activities = [
    { id: 1, title: 'Scope 2 Ledger Verification', desc: 'Audited and verified facilities energy invoices.', time: '2 hours ago', type: 'compliance' },
    { id: 2, title: 'Volunteer Challenge Complete', desc: 'Zero Waste Week achieved 92% employee participation.', time: '1 day ago', type: 'social' },
    { id: 3, title: 'New ESG Policy Published', desc: 'Supplier Code of Conduct v1.4 signed by executives.', time: '2 days ago', type: 'governance' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground/90">
            ESG Command Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Enterprise overview of environmental footprint, social engagement, and governance scores.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-muted-foreground/80 font-semibold uppercase tracking-wider">
            Last synced: Today, 12:00 PM
          </span>
          <Badge variant="success">Compliant</Badge>
        </div>
      </div>

      {/* Main Executive Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Giant ESG Rating Card (linear style) */}
        <Card className="md:col-span-1 bg-premium-gradient border border-border/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
              Executive ESG Index
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-[180px] pt-0">
            <div className="flex items-baseline space-x-2">
              <span className="text-6xl font-extrabold tracking-tight text-primary">94.2</span>
              <span className="text-lg font-bold text-muted-foreground">/100</span>
            </div>
            
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">ESG Rating</span>
                <span className="font-bold text-foreground">AAA Class</span>
              </div>
              <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '94.2%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                <span>E: 92.5</span>
                <span>S: 94.0</span>
                <span>G: 96.2</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic metrics summaries */}
        <Card interactive className="md:col-span-1 flex flex-col justify-between p-7">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Environmental</span>
              <h3 className="text-3xl font-extrabold tracking-tight text-foreground/90">84.6 tCO2e</h3>
              <p className="text-[11px] text-green-600 dark:text-green-400 font-semibold flex items-center space-x-1">
                <TrendingDown className="h-3.5 w-3.5" />
                <span>12.4% vs last quarter</span>
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/5">
              <Leaf className="h-5 w-5" />
            </div>
          </div>
          
          <div className="border-t border-border/40 pt-4 mt-6 flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-semibold">Goal: Net Zero 2030</span>
            <span className="font-bold text-foreground flex items-center">
              View Analytics <ArrowUpRight className="h-3.5 w-3.5 ml-0.5 text-muted-foreground" />
            </span>
          </div>
        </Card>

        <Card interactive className="md:col-span-1 flex flex-col justify-between p-7">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Social Impact</span>
              <h3 className="text-3xl font-extrabold tracking-tight text-foreground/90">465 Hours</h3>
              <p className="text-[11px] text-primary font-semibold flex items-center space-x-1">
                <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                <span>+18.2% volunteering hours</span>
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/5">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="border-t border-border/40 pt-4 mt-6 flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-semibold">Participation: 84%</span>
            <span className="font-bold text-foreground flex items-center">
              View Challenges <ArrowUpRight className="h-3.5 w-3.5 ml-0.5 text-muted-foreground" />
            </span>
          </div>
        </Card>
      </div>

      {/* Charts & Insights Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-1">
          <CardHeader>
            <CardTitle>Scope 1 vs Scope 2 Emissions</CardTitle>
            <CardDescription>Visual audit of carbon emissions (metric tons of CO2 equivalent) monthly.</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={carbonTrends}
              xKey="name"
              dataKeys={['Scope1', 'Scope2']}
            />
          </CardContent>
        </Card>

        <Card className="p-1">
          <CardHeader>
            <CardTitle>Volunteer Hours vs Target</CardTitle>
            <CardDescription>Employee participation comparison against corporate targets.</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={volunteerParticipation}
              xKey="name"
              dataKeys={['target', 'actual']}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Log & Quick Audit Info */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent ESG Activity Ledger</CardTitle>
            <CardDescription>Latest changes, verifications, and compliance milestones.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="flex justify-between items-start p-3.5 rounded-xl border border-border/50 hover:bg-muted/40 transition-colors duration-200">
                <div className="flex space-x-3.5 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    act.type === 'compliance' ? 'bg-primary/10 text-primary' : act.type === 'social' ? 'bg-secondary/10 text-secondary' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {act.type === 'compliance' ? <CheckCircle2 className="h-4.5 w-4.5" /> : act.type === 'social' ? <Users className="h-4.5 w-4.5" /> : <ShieldAlert className="h-4.5 w-4.5" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-foreground/90 truncate leading-none mb-1">{act.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{act.desc}</p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground/60 font-semibold shrink-0 uppercase tracking-wider">{act.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-1 bg-muted/20 border border-border/60">
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
            <CardDescription>Automated AI recommendations based on latest ledger metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs leading-relaxed">
            <div className="p-3 bg-card border border-border/40 rounded-xl">
              <span className="font-bold text-primary flex items-center space-x-1.5">
                <Award className="h-4 w-4 shrink-0" />
                <span>Scope 2 Target Pathway</span>
              </span>
              <p className="text-muted-foreground mt-1.5 text-xs font-semibold">
                Facilities electricity indexes are trending down. Excellent progress towards the net-zero milestone.
              </p>
            </div>

            <div className="p-3 bg-card border border-border/40 rounded-xl">
              <span className="font-bold text-amber-600 flex items-center space-x-1.5">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Upcoming Audit Check</span>
              </span>
              <p className="text-muted-foreground mt-1.5 text-xs font-semibold">
                Quarterly Social Contribution audit is scheduled tomorrow. Ensure volunteering sheets are fully signed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;
