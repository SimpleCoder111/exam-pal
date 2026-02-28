import { BookOpen, User, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { studentNavItems } from '@/config/studentNavItems';
import { useStudentSubjects } from '@/hooks/useStudentSubjects';
import { format, parseISO } from 'date-fns';

const StudentSubjectsReal = () => {
  const { data: subjects, isLoading, error } = useStudentSubjects();

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Subjects</h1>
            <p className="text-muted-foreground">Track your enrolled subjects and upcoming exams</p>
          </div>
          <Badge variant="outline" className="px-3 py-1 w-fit">
            <BookOpen className="w-4 h-4 mr-1" />
            {isLoading ? '…' : (subjects?.length ?? 0)} Enrolled
          </Badge>
        </div>

        {/* Subject List */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-destructive text-center">Failed to load subjects. Please try again later.</p>
            </CardContent>
          </Card>
        ) : !subjects || subjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">No Enrolled Subjects</h3>
              <p className="text-muted-foreground mt-1">You are not enrolled in any subjects yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Card
                key={subject.subjectId}
                className="transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="outline">{subject.subjectId}</Badge>
                  </div>
                  <CardTitle className="mt-3">{subject.subjectName || '—'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Teacher */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{subject.teacherName || '—'}</span>
                    </div>

                    {/* Next Exam */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Next exam:</span>
                      {subject.nextExamDate ? (
                        <span className="font-medium">
                          {format(parseISO(subject.nextExamDate), 'MMM d, yyyy h:mm a')}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>

                    {/* Placeholder sections for future API data */}
                    <div className="pt-2 border-t border-border space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-xs text-muted-foreground italic">Coming soon</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Avg Score</span>
                        <span className="text-xs text-muted-foreground italic">Coming soon</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentSubjectsReal;
