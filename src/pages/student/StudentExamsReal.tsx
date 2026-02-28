import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Calendar, Clock, BookOpen, Shield, AlertTriangle, Timer,
  Play, Lock, CheckCircle2, XCircle, Eye, EyeOff, Copy, Minimize2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { studentNavItems } from '@/config/studentNavItems';
import { useStudentExams, StudentExam } from '@/hooks/useStudentExams';

const examRules = [
  { icon: Eye, title: 'No Tab Switching', description: 'Switching to other tabs or windows will be detected and counted as suspicious activity.' },
  { icon: Minimize2, title: 'No Window Minimizing', description: 'Minimizing the browser window is not allowed during the exam.' },
  { icon: Copy, title: 'No Copy & Paste', description: 'Copy and paste functionality is disabled during the exam.' },
  { icon: EyeOff, title: 'No Developer Tools', description: 'Opening browser developer tools or web inspector is strictly prohibited.' },
  { icon: Shield, title: '3 Warnings Policy', description: 'You have 3 chances. On the 4th violation, your exam will be auto-submitted.' },
  { icon: Timer, title: 'Auto-Save Enabled', description: 'Your answers are automatically saved. You can continue even after network issues.' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'UP_COMING':
      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Upcoming</Badge>;
    case 'ACTIVE':
    case 'ON_GOING':
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>;
    case 'COMPLETED':
    case 'DONE':
      return <Badge className="bg-primary/10 text-primary border-primary/20">Completed</Badge>;
    case 'MISSED':
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Missed</Badge>;
    default:
      return <Badge variant="outline">{status || '—'}</Badge>;
  }
};

const formatExamDate = (dateStr: string | null) => {
  if (!dateStr) return '—';
  try {
    return format(new Date(dateStr), 'MMM d, yyyy \'at\' hh:mm a');
  } catch {
    return '—';
  }
};

const getTotalQuestions = (exam: StudentExam) => {
  const fromDifficulty = (exam.easyQuestions || 0) + (exam.mediumQuestions || 0) + (exam.hardQuestions || 0);
  const fromIds = exam.questionIds?.length || 0;
  return fromDifficulty > 0 ? fromDifficulty : fromIds;
};

const canTakeExam = (exam: StudentExam) => {
  return exam.examStatus === 'ACTIVE' || exam.examStatus === 'ON_GOING' || exam.examStatus === 'UP_COMING';
};

const StudentExamsReal = () => {
  const navigate = useNavigate();
  const { data: exams, isLoading, error } = useStudentExams();
  const [selectedExam, setSelectedExam] = useState<StudentExam | null>(null);
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const upcomingExams = (exams ?? []).filter(e => e.examStatus === 'UP_COMING' || e.examStatus === 'ACTIVE' || e.examStatus === 'ON_GOING');
  const completedExams = (exams ?? []).filter(e => e.examStatus === 'COMPLETED' || e.examStatus === 'DONE' || e.examStatus === 'MISSED');

  const handleEnterExam = (exam: StudentExam) => {
    setSelectedExam(exam);
    setShowRulesDialog(true);
    setRulesAccepted(false);
  };

  const handleStartExam = () => {
    if (selectedExam && rulesAccepted) {
      setShowRulesDialog(false);
      navigate(`/exam?subjectId=${selectedExam.subjectId}&examId=${selectedExam.examId}&secure=true`);
    }
  };

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">My Exams</h1>
          <p className="text-muted-foreground">View and take your scheduled examinations</p>
        </div>

        {/* Active exam alert */}
        {upcomingExams.some(canTakeExam) && (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">You have an active exam!</h3>
                <p className="text-sm text-muted-foreground">You can enter the exam now.</p>
              </div>
            </CardContent>
          </Card>
        )}

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
                </Card>
              ) : (
                <div className="grid gap-4">
                  {upcomingExams.map((exam) => (
                    <Card key={exam.examId} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-foreground">{exam.examTitle || '—'}</h3>
                              {getStatusBadge(exam.examStatus)}
                              {exam.examPaperType && (
                                <Badge variant="outline" className="text-xs">{exam.examPaperType}</Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatExamDate(exam.examDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {exam.duration ? `${exam.duration} min` : '—'}
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {getTotalQuestions(exam) > 0 ? `${getTotalQuestions(exam)} questions` : '—'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            {canTakeExam(exam) ? (
                              <Button onClick={() => handleEnterExam(exam)} className="gap-2">
                                <Play className="w-4 h-4" />
                                Enter Exam
                              </Button>
                            ) : (
                              <Button disabled variant="outline" className="gap-2">
                                <Lock className="w-4 h-4" />
                                Not Available
                              </Button>
                            )}
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
                  <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Exams</h3>
                  <p className="text-muted-foreground">You haven't completed any exams yet.</p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {completedExams.map((exam) => (
                    <Card key={exam.examId} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-foreground">{exam.examTitle || '—'}</h3>
                              {getStatusBadge(exam.examStatus)}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatExamDate(exam.examDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {exam.duration ? `${exam.duration} min` : '—'}
                              </span>
                            </div>
                          </div>
                          {exam.examStatus === 'MISSED' && (
                            <div className="flex items-center gap-2 text-destructive">
                              <XCircle className="w-5 h-5" />
                              <span className="font-medium">Missed</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Security Info */}
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

      {/* Exam Rules Dialog */}
      <Dialog open={showRulesDialog} onOpenChange={setShowRulesDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Shield className="w-6 h-6 text-primary" />
              Exam Rules & Guidelines
            </DialogTitle>
            <DialogDescription>
              Please read and accept the following rules before starting your exam.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            {selectedExam && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-foreground">{selectedExam.examTitle || '—'}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Duration: {selectedExam.duration || '—'} minutes • {getTotalQuestions(selectedExam) > 0 ? `${getTotalQuestions(selectedExam)} questions` : '—'}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {examRules.map((rule, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 rounded-full bg-background">
                    <rule.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground">{rule.title}</h5>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <h5 className="font-medium text-foreground">Important Warning</h5>
                  <p className="text-sm text-muted-foreground">
                    Violating exam rules 4 times will result in automatic submission of your exam.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="accept-rules"
                checked={rulesAccepted}
                onCheckedChange={(checked) => setRulesAccepted(checked === true)}
              />
              <label htmlFor="accept-rules" className="text-sm font-medium leading-none">
                I have read and agree to follow all exam rules
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowRulesDialog(false)}>Cancel</Button>
            <Button onClick={handleStartExam} disabled={!rulesAccepted} className="gap-2">
              <Play className="w-4 h-4" />
              Start Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentExamsReal;
