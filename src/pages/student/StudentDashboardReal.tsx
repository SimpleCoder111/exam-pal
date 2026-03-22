import { 
  BookOpen, 
  Clock, 
  Trophy,
  Calendar,
  ArrowRight,
  CheckCircle,
  Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Link } from 'react-router-dom';
import { studentNavItems } from '@/config/studentNavItems';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useStudentSubjects } from '@/hooks/useStudentSubjects';
import { useStudentResults } from '@/hooks/useStudentResults';
import { useStudentExams } from '@/hooks/useStudentExams';
import { format, parseISO, isFuture } from 'date-fns';

const formatName = (name?: string | null) => {
  if (!name) return 'Student';
  return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-primary';
  return 'text-destructive';
};

const StudentDashboardReal = () => {
  const { data: profile, isLoading: profileLoading, error: profileError } = useStudentProfile();
  const { data: subjects, isLoading: subjectsLoading } = useStudentSubjects();
  const { data: results, isLoading: resultsLoading } = useStudentResults();
  const { data: exams, isLoading: examsLoading } = useStudentExams();

  console.log('[StudentDashboard] profile:', profile, 'subjects:', subjects, 'results:', results, 'exams:', exams);
  console.log('[StudentDashboard] loading:', { profileLoading, subjectsLoading, resultsLoading, examsLoading });
  console.log('[StudentDashboard] errors:', { profileError });

  // Computed stats from real data
  const resultsArray = Array.isArray(results) ? results : [];
  const examsArray = Array.isArray(exams) ? exams : [];

  const averageScore = resultsArray.length
    ? Math.round(resultsArray.reduce((sum, r) => sum + (r.score ?? 0), 0) / resultsArray.length)
    : null;

  const upcomingExams = examsArray.filter(e => {
    try {
      return e.examStatus === 'UPCOMING' || isFuture(parseISO(e.examDate));
    } catch {
      return false;
    }
  });

  const recentResults = resultsArray.slice(0, 4);

  // Best score for "rank" placeholder
  const bestScore = resultsArray.length ? Math.max(...resultsArray.map(r => r.score ?? 0)) : null;

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {profileLoading ? (
              <Skeleton className="h-9 w-64 mb-2" />
            ) : (
              <h1 className="font-heading text-3xl font-semibold text-foreground">
                Welcome Back, {formatName(profile?.name)}!
              </h1>
            )}
            <p className="text-muted-foreground mt-1">Here's your learning progress and upcoming activities.</p>
          </div>
          <Link to="/exam">
            <Button>
              <BookOpen className="w-4 h-4 mr-2" />
              Take Practice Exam
            </Button>
          </Link>
        </div>

        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : profileError ? (
              <p className="text-sm text-destructive">Failed to load profile. Please try again later.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-medium text-foreground">{profile?.id || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{profile?.email || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{profile?.phoneNumber || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium text-foreground">
                    {profile?.gender === 'M' ? 'Male' : profile?.gender === 'F' ? 'Female' : profile?.gender || '—'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-semibold text-foreground">
                {subjectsLoading ? <Skeleton className="h-7 w-8 mx-auto" /> : (subjects?.length ?? '—')}
              </p>
              <p className="text-sm text-muted-foreground">Enrolled Subjects</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-accent-foreground" />
              </div>
              <p className="text-2xl font-semibold text-foreground">
                {examsLoading ? <Skeleton className="h-7 w-8 mx-auto" /> : upcomingExams.length}
              </p>
              <p className="text-sm text-muted-foreground">Upcoming Exams</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <p className={`text-2xl font-semibold ${averageScore !== null ? getScoreColor(averageScore) : 'text-foreground'}`}>
                {resultsLoading ? <Skeleton className="h-7 w-8 mx-auto" /> : (averageScore !== null ? `${averageScore}%` : '—')}
              </p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6 text-accent-foreground" />
              </div>
              <p className={`text-2xl font-semibold ${bestScore !== null ? getScoreColor(bestScore) : 'text-foreground'}`}>
                {resultsLoading ? <Skeleton className="h-7 w-8 mx-auto" /> : (bestScore !== null ? `${bestScore}%` : '—')}
              </p>
              <p className="text-sm text-muted-foreground">Best Score</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Enrolled Subjects */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-heading">My Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              {subjectsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : !subjects || subjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No enrolled subjects found.</p>
              ) : (
                <div className="space-y-3">
                  {subjects.map((s) => (
                    <div key={s.subjectId} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground">{s.subjectName}</p>
                        <p className="text-sm text-muted-foreground">{s.teacherName || '—'}</p>
                      </div>
                      <div className="text-right">
                        {s.nextExamDate ? (
                          <Badge variant="outline" className="gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(parseISO(s.nextExamDate), 'MMM d, yyyy')}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">No upcoming exam</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Recent Results
              </CardTitle>
              <Link to="/student/results">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {resultsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : recentResults.length === 0 ? (
                <p className="text-sm text-muted-foreground">No results yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentResults.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground text-sm truncate">{r.exam.examTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(r.gradedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <span className={`text-lg font-semibold ${getScoreColor(r.score)}`}>
                        {r.score}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Exams */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading">Upcoming Exams</CardTitle>
              <Link to="/student/exams">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {examsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : upcomingExams.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming exams.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingExams.slice(0, 4).map((e) => (
                    <div key={e.examId} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground text-sm">{e.examTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(e.examDate), 'MMM d, yyyy · h:mm a')} · {e.duration} min
                        </p>
                      </div>
                      <Badge variant="secondary">{e.examStatus}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exam Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {resultsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : resultsArray.length === 0 ? (
                <p className="text-sm text-muted-foreground">No performance data yet.</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Exams Taken</span>
                    <span className="font-medium text-foreground">{resultsArray.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Average Score</span>
                    <span className={`font-medium ${averageScore !== null ? getScoreColor(averageScore) : ''}`}>
                      {averageScore !== null ? `${averageScore}%` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Best Score</span>
                    <span className={`font-medium ${bestScore !== null ? getScoreColor(bestScore) : ''}`}>
                      {bestScore !== null ? `${bestScore}%` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pass Rate (≥50%)</span>
                    <span className="font-medium text-foreground">
                      {Math.round((resultsArray.filter(r => r.score >= 50).length / resultsArray.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Time Taken</span>
                    <span className="font-medium text-foreground">
                      {Math.round(resultsArray.reduce((s, r) => s + (r.timeTaken ?? 0), 0) / resultsArray.length)} min
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboardReal;
