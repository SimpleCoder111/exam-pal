import { Users, Sparkles, TrendingUp, Trophy, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { studentNavItems } from '@/config/studentNavItems';
import { useStudentProfile } from '@/hooks/useStudentProfile';

const StudentClassroomsReal = () => {
  const { data: profile, isLoading: profileLoading } = useStudentProfile();
  const studentName = profile?.name || '—';

  // Placeholder: no classroom API integrated yet
  const classrooms: any[] = [];
  const isLoading = false;
  const error = null;

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Classrooms</h1>
            <p className="text-muted-foreground">Track your performance and compete with classmates</p>
          </div>
        </div>

        {/* Motivation Banner */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-xl font-semibold">
                  {profileLoading ? <Skeleton className="h-6 w-48 inline-block" /> : `Welcome, ${studentName}!`}
                </h3>
                <p className="text-muted-foreground mt-1">
                  Your classroom data will appear here once the API is connected.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center px-4 py-2 rounded-xl bg-background/50">
                  <p className="text-2xl font-bold text-primary">—</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
                <div className="text-center px-4 py-2 rounded-xl bg-background/50">
                  <p className="text-2xl font-bold text-primary">—</p>
                  <p className="text-xs text-muted-foreground">Avg Rank</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Active Classes', icon: Users, value: '0' },
            { label: 'Improving In', icon: TrendingUp, value: '0' },
            { label: 'Best Rank', icon: Trophy, value: '—' },
            { label: 'Best Score', icon: Award, value: '—' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Classrooms List */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-destructive text-center">Failed to load classrooms. Please try again later.</p>
            </CardContent>
          </Card>
        ) : classrooms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">No Classrooms Yet</h3>
              <p className="text-muted-foreground mt-1">
                Classroom data will appear here once the API is integrated.
              </p>
              <Badge variant="outline" className="mt-3">API integration pending</Badge>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default StudentClassroomsReal;
