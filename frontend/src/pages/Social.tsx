import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { BarChart } from '../components/charts/BarChart';
import { Users, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';

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

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
            <Users className="h-8 w-8 text-blue-500 shrink-0" />
            <span>Social (S) Engagement</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor community CSR activity, employee volunteering hours, health initiatives, and internal rewards.
          </p>
        </div>
        <Button variant="primary" className="flex items-center space-x-1.5 w-fit">
          <Award className="h-4 w-4" />
          <span>Award Badge</span>
        </Button>
      </div>

      {/* Graphs */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>CSR Volunteering Hours</CardTitle>
            <CardDescription>Aggregate monthly hours contributed by organization employees.</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={csrTrends}
              xKey="month"
              dataKeys={['volunteeringHours']}
              colors={['#3b82f6']}
            />
          </CardContent>
        </Card>

        {/* Gamified stats panel */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Summary</CardTitle>
            <CardDescription>Overview of employee gamification programs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3.5 border border-border rounded-lg">
              <span className="text-sm font-semibold">Active Challenges</span>
              <Badge variant="primary">2 Active</Badge>
            </div>
            <div className="flex justify-between items-center p-3.5 border border-border rounded-lg">
              <span className="text-sm font-semibold">Badges Awarded</span>
              <span className="text-lg font-bold text-foreground">148 Badges</span>
            </div>
            <div className="flex justify-between items-center p-3.5 border border-border rounded-lg">
              <span className="text-sm font-semibold">Participation Rate</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">76.4%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenges table */}
      <Card>
        <CardHeader>
          <CardTitle>Organization ESG Challenges</CardTitle>
          <CardDescription>Promote eco-friendly habits and award points redeemable for badges.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challenge Name</TableHead>
                <TableHead>Redeemable Points</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeChallenges.map((ch) => (
                <TableRow key={ch.id}>
                  <TableCell className="font-semibold text-foreground">{ch.title}</TableCell>
                  <TableCell>{ch.points} Points</TableCell>
                  <TableCell>{ch.end}</TableCell>
                  <TableCell>
                    <Badge variant={ch.status === 'ACTIVE' ? 'success' : 'neutral'}>
                      {ch.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      {ch.status === 'ACTIVE' ? 'Join Challenge' : 'View Details'}
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
export default Social;
