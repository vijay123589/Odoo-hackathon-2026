import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { BarChart } from '@/components/charts/BarChart';
import { Users, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Social: React.FC = () => {
  const csrTrends = [
    { month: 'Mar', volunteeringHours: 120 },
    { month: 'Apr', volunteeringHours: 155 },
    { month: 'May', volunteeringHours: 210 },
    { month: 'Jun', volunteeringHours: 245 },
  ];

  const activeChallenges = [
    { id: '1', title: 'Zero Waste Week', points: 150, end: '2026-07-20', status: 'ACTIVE' },
    { id: '2', title: 'Cycle to Work July', points: 300, end: '2026-07-31', status: 'ACTIVE' },
    { id: '3', title: 'ESG Policy Certification', points: 100, end: '2026-08-15', status: 'UPCOMING' },
  ];

  const leaderboards = [
    { name: 'Sarah Jenkins', dept: 'Engineering', hours: 42, avatar: 'SJ' },
    { name: 'David Chen', dept: 'Finance', hours: 38, avatar: 'DC' },
    { name: 'Elena Rostova', dept: 'Marketing', hours: 35, avatar: 'ER' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Warm organic banner header */}
      <div className="relative rounded-3xl bg-premium-gradient border border-secondary/15 p-8 overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="absolute top-0 right-0 translate-x-[20%] translate-y-[-20%] pointer-events-none opacity-20 select-none">
          <svg width="300" height="300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-secondary">
            <circle cx="100" cy="100" r="80" fill="currentColor" fillOpacity="0.04"/>
          </svg>
        </div>

        <div className="space-y-2">
          <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/10">CSR & Engagement</Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground/90 flex items-center space-x-2.5">
            <Users className="h-8 w-8 text-secondary shrink-0" />
            <span>Social Engagement</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            Organize community volunteer events, encourage employee ESG challenge participation, track CSR hours, and issue achievement badges.
          </p>
        </div>
        
        <Button variant="secondary" className="flex items-center space-x-2 self-start md:self-auto h-11 shadow-sm">
          <Award className="h-4.5 w-4.5" />
          <span>Award Badge</span>
        </Button>
      </div>

      {/* Graphics Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>CSR Volunteer Hour Contributions</CardTitle>
            <CardDescription>Aggregate monthly hours contributed by organization employees.</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={csrTrends}
              xKey="month"
              dataKeys={['volunteeringHours']}
            />
          </CardContent>
        </Card>

        {/* Volunteering Leaderboard / Summaries */}
        <Card className="bg-muted/10 border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-secondary" />
              <span>Volunteering Top Contributors</span>
            </CardTitle>
            <CardDescription>Outstanding employee engagement this quarter.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaderboards.map((user, idx) => (
              <div key={user.name} className="flex justify-between items-center p-3 bg-card border border-border/40 rounded-xl shadow-[0_2px_8px_rgba(28,38,30,0.01)]">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-secondary/10 text-secondary font-bold text-xs flex items-center justify-center border border-secondary/5">
                    {user.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground/80 leading-none mb-1">{user.name}</h4>
                    <span className="text-[9px] text-muted-foreground/60 font-semibold">{user.dept}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-foreground/90">{user.hours} hrs</span>
                  <p className="text-[8px] text-secondary font-bold uppercase tracking-wider mt-0.5">Rank #{idx+1}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Challenges & Events */}
      <Card>
        <CardHeader>
          <CardTitle>Corporate ESG Challenges</CardTitle>
          <CardDescription>Participate in active eco-challenges to earn reward points redeemable for badges.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Challenge Name</TableHead>
                  <TableHead>Redeemable Points</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeChallenges.map((ch) => (
                  <TableRow key={ch.id}>
                    <TableCell className="font-bold text-foreground/90 pl-6">{ch.title}</TableCell>
                    <TableCell className="font-semibold text-muted-foreground">{ch.points} pts</TableCell>
                    <TableCell className="text-muted-foreground">{ch.end}</TableCell>
                    <TableCell>
                      <Badge variant={ch.status === 'ACTIVE' ? 'success' : 'neutral'}>
                        {ch.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="outline" size="sm">
                        {ch.status === 'ACTIVE' ? 'Join Challenge' : 'View Details'}
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
export default Social;
