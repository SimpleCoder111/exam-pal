import { BookOpen, User, Calendar, Trophy, FileText, Users, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { studentNavItems } from '@/config/studentNavItems';
import { useStudentSubjects } from '@/hooks/useStudentSubjects';
import { useStudentClassrooms } from '@/hooks/useStudentClassrooms';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { format, parseISO, isFuture } from 'date-fns';
import { Link } from 'react-router-dom';

const StudentClassesReal = () => {
  const { data: profile, isLoading: profileLoading } = useStudentProfile();
  const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useStudentSubjects();
  const { data: classrooms, isLoading: classroomsLoading } = useStudentClassrooms();

  const isLoading = subjectsLoading || classroomsLoading;
  const classroomsArray = classrooms ?? [];
  const activeClasses = classroomsArray.filter(c => {
    try { return isFuture(parseISO(c.classEnd)); } catch { return false; }
  });

  // Map classrooms by subjectId for merging
  const classroomsBySubject = new Map<number, typeof classroomsArray>();
  classroomsArray.forEach(c => {
    const list = classroomsBySubject.get(c.subjectId) ?? [];
    list.push(c);
    classroomsBySubject.set(c.subjectId, list);
  });

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
            <p className="text-muted-foreground">Your enrolled subjects, classrooms, and schedules</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              {isLoading ? '…' : (subjects?.length ?? 0)} Subjects
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Users className="w-3.5 h-3.5 mr-1" />
              {isLoading ? '…' : classroomsArray.length} Classrooms
            </Badge>
          </div>
        </div>

        {/* Motivation Banner */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="py-5">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {profileLoading ? <Skeleton className="h-6 w-48 inline-block" /> : `Welcome, ${profile?.name ?? 'Student'}!`}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  You have {activeClasses.length} active classroom{activeClasses.length !== 1 ? 's' : ''} across {subjects?.length ?? 0} subject{(subjects?.length ?? 0) !== 1 ? 's' : ''}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Cards with Classroom Info */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : subjectsError ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-destructive text-center">Failed to load classes. Please try again later.</p>
            </CardContent>
          </Card>
        ) : !subjects || subjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">No Enrolled Classes</h3>
              <p className="text-muted-foreground mt-1">You are not enrolled in any classes yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => {
              const relatedClassrooms = classroomsBySubject.get(Number(subject.subjectId)) ?? [];

              return (
                <Card
                  key={subject.subjectId}
                  className="transition-all hover:shadow-lg hover:border-primary/50"
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
                    <div className="space-y-3">
                      {/* Teacher */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{subject.teacherName || '—'}</span>
                      </div>

                      {/* Next Exam */}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Next exam:</span>
                        <span className="font-medium text-foreground">
                          {subject.nextExamDate ? format(parseISO(subject.nextExamDate), 'MMM d, yyyy h:mm a') : ''}
                        </span>
                      </div>

                      {/* Classroom Info */}
                      {relatedClassrooms.length > 0 && (
                        <div className="pt-2 border-t border-border space-y-2">
                          {relatedClassrooms.map(c => {
                            const isActive = (() => { try { return isFuture(parseISO(c.classEnd)); } catch { return false; } })();
                            return (
                              <div key={c.classId} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Users className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                  <span className="truncate text-muted-foreground">{c.className}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-xs text-muted-foreground">{c.academicYear}</span>
                                  <Badge variant={isActive ? 'default' : 'secondary'} className="text-[10px] h-5">
                                    {isActive ? 'Active' : 'Ended'}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Quick Links */}
                      <div className="pt-2 border-t border-border flex gap-2">
                        <Link to={`/student/exams?subjectId=${subject.subjectId}&subjectName=${encodeURIComponent(subject.subjectName)}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            Exams
                          </Button>
                        </Link>
                        <Link to={`/student/results?subjectId=${subject.subjectId}&subjectName=${encodeURIComponent(subject.subjectName)}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-1.5">
                            <Trophy className="w-3.5 h-3.5" />
                            Results
                          </Button>
                        </Link>
                      </div>
                    </div>
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

export default StudentClassesReal;
