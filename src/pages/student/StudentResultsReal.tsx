import { Trophy, Target, BookOpen, TrendingUp, Star, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { studentNavItems } from '@/config/studentNavItems';

const StudentResultsReal = () => {
  // Placeholder: no results API integrated yet
  const examHistory: any[] = [];
  const isLoading = false;
  const error = null;

  const overallStats = {
    averageScore: 0,
    totalExams: 0,
    passRate: 0,
    bestSubject: '—',
    improvement: 0,
  };

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">My Results</h1>
          <p className="text-muted-foreground mt-1">Track your exam performance and progress over time</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Average Score', value: overallStats.averageScore ? `${overallStats.averageScore}%` : '—', icon: Target, gradient: 'from-primary/10 to-primary/5 border-primary/20' },
            { label: 'Pass Rate', value: overallStats.passRate ? `${overallStats.passRate}%` : '—', icon: Trophy, gradient: 'from-primary/10 to-primary/5 border-primary/20' },
            { label: 'Exams Taken', value: overallStats.totalExams || '0', icon: BookOpen, gradient: 'from-accent/10 to-accent/5 border-accent/20' },
            { label: 'Best Subject', value: overallStats.bestSubject, icon: Star, gradient: 'from-secondary/10 to-secondary/5 border-secondary/20' },
            { label: 'Improvement', value: overallStats.improvement ? `+${overallStats.improvement}%` : '—', icon: TrendingUp, gradient: 'from-primary/10 to-primary/5 border-primary/20' },
          ].map((stat) => (
            <Card key={stat.label} className={`bg-gradient-to-br ${stat.gradient}`}>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="history" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Exam History</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Study Plan</span>
              <span className="sm:hidden">Study</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-destructive text-center">Failed to load results. Please try again later.</p>
                </CardContent>
              </Card>
            ) : examHistory.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Trophy className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg">No Results Yet</h3>
                  <p className="text-muted-foreground mt-1">Your exam results will appear here once the API is integrated.</p>
                  <Badge variant="outline" className="mt-3">API integration pending</Badge>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {examHistory.map((exam: any) => (
                  <Card key={exam.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold">{exam.name || '—'}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {exam.subject || '—'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {exam.timeSpent || '—'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{exam.score ?? '—'}%</p>
                          <p className="text-xs text-muted-foreground">
                            {exam.correctAnswers ?? 0}/{exam.totalQuestions ?? 0} correct
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg">Analytics Coming Soon</h3>
                <p className="text-muted-foreground mt-1">Performance charts and trends will appear here once results data is available.</p>
                <Badge variant="outline" className="mt-3">API integration pending</Badge>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg">Study Plan Coming Soon</h3>
                <p className="text-muted-foreground mt-1">Personalized recommendations will appear here based on your exam results.</p>
                <Badge variant="outline" className="mt-3">API integration pending</Badge>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentResultsReal;
