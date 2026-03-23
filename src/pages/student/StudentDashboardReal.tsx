import { 
  BookOpen, 
  Clock, 
  Trophy,
  Calendar,
  ArrowRight,
  CheckCircle,
  Star,
  AlertTriangle,
  Users,
  TrendingUp,
  FileText,
  Hourglass,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Link } from 'react-router-dom';
import { studentNavItems } from '@/config/studentNavItems';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useStudentSubjects } from '@/hooks/useStudentSubjects';
import { useStudentResults } from '@/hooks/useStudentResults';
import { useStudentExams } from '@/hooks/useStudentExams';
import { useStudentClassrooms } from '@/hooks/useStudentClassrooms';
import { format, parseISO, isFuture } from 'date-fns';

const formatName = (name?: string | null) => {
  if (!name) return 'Student';
  return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 50) return 'text-primary';
  return 'text-destructive';
};

const getGradeColor = (grade: string) => {
  if (grade === 'A' || grade === 'A+') return 'text-green-600 dark:text-green-400';
  if (grade === 'B' || grade === 'B+') return 'text-primary';
  if (grade === 'C' || grade === 'C+') return 'text-amber-600 dark:text-amber-400';
  if (grade === 'PENDING') return 'text-muted-foreground';
  return 'text-destructive';
};

const formatTimeTaken = (ms: number): string => {
  if (!ms || ms === 0) return '—';
  const absMs = Math.abs(ms);
  if (absMs < 1000) return `${absMs}ms`;
  const totalSeconds = Math.floor(absMs / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}mn ${s}s`;
};

const StudentDashboardReal = () => {
  const { data: profile, isLoading: profileLoading, error: profileError } = useStudentProfile();
  const { data: subjects, isLoading: subjectsLoading } = useStudentSubjects();
  const { data: results, isLoading: resultsLoading } = useStudentResults();
  const { data: exams, isLoading: examsLoading } = useStudentExams();
  const { data: classrooms, isLoading: classroomsLoading } = useStudentClassrooms();

  const resultsArray = Array.isArray(results) ? results : [];
  const examsArray = Array.isArray(exams) ? exams : [];
  const classroomsArray = Array.isArray(classrooms) ? classrooms : [];

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

  // Missing exams: past exams with no result
  const resultExamIds = new Set(resultsArray.map(r => String(r.examId)));
  const missingExams = examsArray.filter(e => {
    try {
      return !isFuture(parseISO(e.examDate)) && !resultExamIds.has(String(e.examId));
    } catch {
      return false;
    }
  });

  const recentResults = resultsArray.slice(0, 5);
  const bestScore = resultsArray.length ? Math.max(...resultsArray.map(r => r.score ?? 0)) : null;
  const passRate = resultsArray.length
    ? Math.round((resultsArray.filter(r => r.score >= 50).length / resultsArray.length) * 100)
    : 0;
  const pendingCount = resultsArray.filter(r => r.status === 'PENDING_REVIEW').length;
  const gradedCount = resultsArray.filter(r => r.status === 'GRADED').length;

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
          <div className="flex gap-2">
            <Link to="/student/exams">
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                My Exams
              </Button>
            </Link>
            <Link to="/student/results">
              <Button className="gap-2">
                <Trophy className="w-4 h-4" />
                My Results
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Info Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading">My Profile</CardTitle>
            <Link to="/student/settings">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Edit Profile <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
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
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Link to="/student/classes" className="block">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-semibold text-foreground">
                  {subjectsLoading ? <Skeleton className="h-7 w-8 mx-auto" /> : (subjects?.length ?? 0)}
                </p>
                <p className="text-sm text-muted-foreground">Subjects</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/student/classrooms" className="block">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-accent-foreground" />
                </div>
                <p className="text-2xl font-semibold text-foreground">
                  {classroomsLoading ? <Skeleton className="h-7 w-8 mx-auto" /> : classroomsArray.length}
                </p>
                <p className="text-sm text-muted-foreground">Classrooms</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/student/exams" className="block">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-semibold text-foreground">
                  {examsLoading ? <Skeleton className="h-7 w-8 mx-auto" /> : upcomingExams.length}
                </p>
                <p className="text-sm text-muted-foreground">Upcoming Exams</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/student/results" className="block">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-accent-foreground" />
                </div>
                <p className={`text-2xl font-semibold ${averageScore !== null ? getScoreColor(averageScore) : 'text-foreground'}`}>
                  {resultsLoading ? <Skeleton className="h-7 w-8 mx-auto" /> : (averageScore !== null ? `${averageScore}%` : '—')}
                </p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </CardContent>
            </Card>
          </Link>
          {missingExams.length > 0 ? (
            <Link to="/student/results" className="block">
              <Card className="hover:border-destructive/50 transition-colors cursor-pointer h-full border-destructive/30 bg-destructive/5">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <p className="text-2xl font-semibold text-destructive">
                    {missingExams.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Missing Exams</p>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card className="h-full">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <p className={`text-2xl font-semibold ${bestScore !== null ? getScoreColor(bestScore) : 'text-foreground'}`}>
                  {resultsLoading ? <Skeleton className="h-7 w-8 mx-auto" /> : (bestScore !== null ? `${bestScore}%` : '—')}
                </p>
                <p className="text-sm text-muted-foreground">Best Score</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Enrolled Subjects with links */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading">My Subjects</CardTitle>
              <Link to="/student/subjects">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
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
                      <div className="flex items-center gap-2">
                        {s.nextExamDate ? (
                          <Badge variant="outline" className="gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(parseISO(s.nextExamDate), 'MMM d, yyyy')}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">No upcoming exam</span>
                        )}
                        <Link to={`/student/results?subjectId=${s.subjectId}&subjectName=${encodeURIComponent(s.subjectName)}`}>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Trophy className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Results with grade */}
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
                        <p className="font-medium text-foreground text-sm truncate">{r.examName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant={r.status === 'GRADED' ? 'default' : 'secondary'} className="text-[10px] h-5">
                            {r.status === 'GRADED' ? 'Graded' : 'Pending'}
                          </Badge>
                          {r.grade && r.grade !== 'PENDING' && (
                            <span className={`text-xs font-bold ${getGradeColor(r.grade)}`}>{r.grade}</span>
                          )}
                        </div>
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
                <p className="text-sm text-muted-foreground">No upcoming exams. You're all caught up! 🎉</p>
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

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resultsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : resultsArray.length === 0 ? (
                <p className="text-sm text-muted-foreground">No performance data yet. Complete exams to see your stats.</p>
              ) : (
                <div className="space-y-4">
                  {/* Pass rate bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Pass Rate (≥50%)</span>
                      <span className="font-medium text-foreground">{passRate}%</span>
                    </div>
                    <Progress value={passRate} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/30 border text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-lg font-bold text-foreground">{gradedCount}</p>
                      <p className="text-xs text-muted-foreground">Graded</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Hourglass className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-lg font-bold text-foreground">{pendingCount}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>

                  <div className="space-y-2">
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
                    {missingExams.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-destructive flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Missing Exams
                        </span>
                        <Link to="/student/results">
                          <span className="font-medium text-destructive underline">{missingExams.length}</span>
                        </Link>
                      </div>
                    )}
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
