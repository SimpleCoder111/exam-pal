import { Users, Sparkles, TrendingUp, Trophy, Award, Calendar, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { studentNavItems } from '@/config/studentNavItems';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useStudentClassrooms } from '@/hooks/useStudentClassrooms';
import { format, parseISO, isFuture } from 'date-fns';

const StudentClassroomsReal = () => {
  const { data: profile, isLoading: profileLoading } = useStudentProfile();
  const { data: classrooms, isLoading, error } = useStudentClassrooms();
  const studentName = profile?.name || '—';

  const activeClasses = classrooms?.filter(c => isFuture(parseISO(c.classEnd))) ?? [];

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Classrooms</h1>
          <p className="text-muted-foreground">Track your classes and academic schedule</p>
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
                  You are enrolled in {isLoading ? '…' : (classrooms?.length ?? 0)} classroom{classrooms?.length !== 1 ? 's' : ''}.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center px-4 py-2 rounded-xl bg-background/50">
                  <p className="text-2xl font-bold text-primary">
                    {isLoading ? '…' : activeClasses.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <div className="text-center px-4 py-2 rounded-xl bg-background/50">
                  <p className="text-2xl font-bold text-primary">
                    {isLoading ? '…' : (classrooms?.length ?? 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classrooms List */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-destructive text-center">Failed to load classrooms. Please try again later.</p>
            </CardContent>
          </Card>
        ) : !classrooms || classrooms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">No Classrooms Yet</h3>
              <p className="text-muted-foreground mt-1">You haven't been enrolled in any classrooms.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classrooms.map((c) => {
              const isActive = isFuture(parseISO(c.classEnd));
              return (
                <Card key={c.classId} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base font-semibold leading-tight">
                        {c.className}
                      </CardTitle>
                      <Badge variant={isActive ? 'default' : 'secondary'} className="shrink-0 ml-2">
                        {isActive ? 'Active' : 'Ended'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      <span>Academic Year: {c.academicYear}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(parseISO(c.classStart), 'MMM d, yyyy')} — {format(parseISO(c.classEnd), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Teacher: {c.teacherId}</span>
                    </div>
                    {c.classToken && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">Class Code</p>
                        <p className="font-mono text-sm font-medium text-foreground">{c.classToken}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentClassroomsReal;
