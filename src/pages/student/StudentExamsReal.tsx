import { Calendar, Clock, BookOpen, Shield, AlertTriangle, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { studentNavItems } from '@/config/studentNavItems';

const StudentExamsReal = () => {
  // Placeholder: no exams API integrated yet
  const upcomingExams: any[] = [];
  const completedExams: any[] = [];
  const isLoading = false;
  const error = null;

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">My Exams</h1>
          <p className="text-muted-foreground">View and take your scheduled examinations</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-destructive text-center">Failed to load exams. Please try again later.</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming ({upcomingExams.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedExams.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              {upcomingExams.length === 0 ? (
                <Card className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Upcoming Exams</h3>
                  <p className="text-muted-foreground">You don't have any scheduled exams.</p>
                  <Badge variant="outline" className="mt-3">API integration pending</Badge>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {upcomingExams.map((exam: any) => (
                    <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <h3 className="text-lg font-semibold">{exam.title || '—'}</h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {exam.subject || '—'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {exam.duration ? `${exam.duration} minutes` : '—'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              {completedExams.length === 0 ? (
                <Card className="p-12 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Exams</h3>
                  <p className="text-muted-foreground">You haven't completed any exams yet.</p>
                  <Badge variant="outline" className="mt-3">API integration pending</Badge>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {completedExams.map((exam: any) => (
                    <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <h3 className="text-lg font-semibold">{exam.title || '—'}</h3>
                            <p className="text-sm text-muted-foreground">
                              Score: {exam.score ?? '—'}/{exam.totalMarks ?? '—'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Security Info Card */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" />
              Exam Security Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                <p>Our exam system monitors for suspicious activities to ensure exam integrity.</p>
              </div>
              <div className="flex items-start gap-3">
                <Timer className="w-4 h-4 text-primary mt-0.5" />
                <p>Answers are auto-saved every few seconds. You won't lose progress.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentExamsReal;
