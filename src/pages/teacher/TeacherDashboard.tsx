import { 
  BookOpen, 
  FileText, 
  Users,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { teacherNavItems } from '@/config/teacherNavItems';
import { useTeacherSubjects } from '@/hooks/useTeacherSubjects';
import { useTeacherClasses } from '@/hooks/useTeacherClassrooms';
import { useTeacherExams } from '@/hooks/useTeacherExams';
import { useQuestionSummary } from '@/hooks/useTeacherQuestions';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isFuture } from 'date-fns';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { data: subjects, isLoading: subjectsLoading } = useTeacherSubjects();
  const { data: classes, isLoading: classesLoading } = useTeacherClasses();
  const { data: exams, isLoading: examsLoading } = useTeacherExams();
  const { data: summary, isLoading: summaryLoading } = useQuestionSummary();

  const totalQuestions = summary?.totalQuestions ?? 0;
  const totalStudents = classes?.length ?? 0;
  const upcomingExams = exams?.filter(e => {
    try { return isFuture(parseISO(e.examDate)); } catch { return false; }
  }) ?? [];
  const activeExamCount = upcomingExams.length;

  const isLoading = subjectsLoading || classesLoading || examsLoading || summaryLoading;

  const stats = [
    { label: 'Total Questions', value: totalQuestions.toString(), icon: FileText },
    { label: 'Active Exams', value: activeExamCount.toString(), icon: BookOpen },
    { label: 'My Students', value: totalStudents.toString(), icon: Users },
    { label: 'My Subjects', value: (subjects?.length ?? 0).toString(), icon: AlertCircle },
  ];

  return (
    <DashboardLayout navItems={teacherNavItems} role="teacher">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-foreground">Teacher Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your subjects, questions, and exams.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/teacher/question-bank')}>
              <FileText className="w-4 h-4 mr-2" />
              Add Question
            </Button>
            <Button onClick={() => navigate('/teacher/exams')}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Exam
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-7 w-12 mb-1" />
                  ) : (
                    <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Subjects */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">My Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            {subjectsLoading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-28 rounded-lg" />)}
              </div>
            ) : !subjects?.length ? (
              <p className="text-muted-foreground text-sm">No subjects assigned yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {subjects.map((subject) => {
                  const totalQ = subject.chapterResponseList?.reduce((s, c) => s + (c.questionCount ?? 0), 0) ?? 0;
                  const chapters = subject.chapterResponseList?.filter(c => c.active).length ?? 0;
                  return (
                    <div
                      key={subject.id}
                      className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => navigate('/teacher/question-bank')}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <h3 className="font-semibold text-foreground">{subject.name}</h3>
                        <Badge variant="outline" className="ml-auto text-xs">{subject.code}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Questions</p>
                          <p className="font-medium text-foreground">{totalQ}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Chapters</p>
                          <p className="font-medium text-foreground">{chapters}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Exams */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading">Upcoming Exams</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/exams')}>View All</Button>
            </CardHeader>
            <CardContent>
              {examsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
                </div>
              ) : !upcomingExams.length ? (
                <p className="text-muted-foreground text-sm">No upcoming exams.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingExams.slice(0, 4).map((exam) => {
                    let dateStr = '—';
                    try { dateStr = format(parseISO(exam.examDate), 'MMM dd, yyyy hh:mm a'); } catch {}
                    return (
                      <div key={exam.id} className="p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-foreground">{exam.examTitle}</h4>
                          <Badge variant="outline" className="text-xs">
                            {exam.examStatus ?? 'DRAFT'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {dateStr}
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {exam.duration} mins
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Classes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading">My Classes</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/classroom')}>View All</Button>
            </CardHeader>
            <CardContent>
              {classesLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => <Skeleton key={i} className="h-16 rounded-lg" />)}
                </div>
              ) : !classes?.length ? (
                <p className="text-muted-foreground text-sm">No classes assigned yet.</p>
              ) : (
                <div className="space-y-3">
                  {classes.slice(0, 5).map((cls) => (
                    <div key={cls.classId} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{cls.className}</p>
                        <p className="text-sm text-muted-foreground truncate">{cls.academicYear ?? ''}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-xs mt-1">{cls.classStatus}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
