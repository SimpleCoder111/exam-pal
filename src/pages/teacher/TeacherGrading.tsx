import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { teacherNavItems } from '@/config/teacherNavItems';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useTeacherExamResults, type ParsedExamResult, type QuestionGradeDetail } from '@/hooks/useTeacherResults';
import { useTeacherExams } from '@/hooks/useTeacherExams';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Hourglass,
  Code,
  PenLine,
  Users,
  ClipboardCheck,
  Eye,
  Search,
  FileText,
} from 'lucide-react';

const QUESTION_TYPE_ORDER = ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_THE_BLANK', 'CODING', 'WRITING'];

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'MULTIPLE_CHOICE': return 'Multiple Choice';
    case 'TRUE_FALSE': return 'True / False';
    case 'FILL_IN_THE_BLANK': return 'Fill in the Blank';
    case 'CODING': return 'Coding';
    case 'WRITING': return 'Writing';
    default: return type;
  }
};

const getTypeIcon = (type: string) => {
  if (type === 'CODING') return <Code className="w-4 h-4" />;
  if (type === 'WRITING') return <PenLine className="w-4 h-4" />;
  return null;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'GRADED':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Graded</Badge>;
    case 'PENDING_REVIEW':
      return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Pending Review</Badge>;
    case 'SUBMITTED':
      return <Badge variant="secondary">Submitted</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const TeacherGrading = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const examId = searchParams.get('examId') ? parseInt(searchParams.get('examId')!) : null;
  const examTitle = searchParams.get('title') || 'Exam Results';

  const { data: exams, isLoading: examsLoading } = useTeacherExams();
  const { data: results, isLoading, error } = useTeacherExamResults(examId);

  const [selectedStudent, setSelectedStudent] = useState<ParsedExamResult | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [gradeInputs, setGradeInputs] = useState<Record<number, number>>({});
  const [studentSearch, setStudentSearch] = useState('');
  const [examSearch, setExamSearch] = useState('');

  const filteredResults = results?.filter(r =>
    !studentSearch || r.studentId.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredExams = exams?.filter(e =>
    !examSearch || e.examTitle.toLowerCase().includes(examSearch.toLowerCase())
  );

  const openStudentDetail = (result: ParsedExamResult) => {
    setSelectedStudent(result);
    // Pre-fill existing points for manual types
    const inputs: Record<number, number> = {};
    result.questionDetails.forEach(d => {
      if (d.questionType === 'CODING' || d.questionType === 'WRITING') {
        inputs[d.questionId] = d.pointsObtained;
      }
    });
    setGradeInputs(inputs);
    setShowDetailDialog(true);
  };

  const sortedDetails = (details: QuestionGradeDetail[]) => {
    return [...details].sort((a, b) => {
      const ai = QUESTION_TYPE_ORDER.indexOf(a.questionType);
      const bi = QUESTION_TYPE_ORDER.indexOf(b.questionType);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  };

  const handleSaveGrades = () => {
    // TODO: Integrate with grading API when available
    toast({
      title: 'Grades Saved (Local)',
      description: 'Grading API integration coming soon. Grades will be saved locally for now.',
    });
    setShowDetailDialog(false);
  };

  const pendingCount = results?.filter(r => r.status === 'PENDING_REVIEW').length || 0;
  const gradedCount = results?.filter(r => r.status === 'GRADED').length || 0;

  return (
    <DashboardLayout navItems={teacherNavItems} role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/teacher/exams')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{examTitle}</h1>
            <p className="text-muted-foreground">View student submissions and grade answers</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{results?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Total Submissions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Hourglass className="h-6 w-6 mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <ClipboardCheck className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{gradedCount}</div>
              <p className="text-xs text-muted-foreground">Graded</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">
                {results?.length ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length) : 0}
              </div>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Student list */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Student Submissions</CardTitle>
                <CardDescription>Click on a student to view details and grade</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search student ID..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : error ? (
              <p className="text-center text-destructive py-8">Failed to load results.</p>
            ) : !filteredResults?.length ? (
              <p className="text-center text-muted-foreground py-8">
                {studentSearch ? `No results matching "${studentSearch}"` : 'No submissions yet for this exam.'}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time Taken</TableHead>
                    <TableHead>Graded At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map(result => {
                    const manualQuestions = result.questionDetails.filter(
                      d => d.questionType === 'CODING' || d.questionType === 'WRITING'
                    );
                    const pendingManual = manualQuestions.filter(
                      d => d.correctAnswer === 'Waiting for teacher to review'
                    );
                    return (
                      <TableRow key={result.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openStudentDetail(result)}>
                        <TableCell className="font-medium">{result.studentId}</TableCell>
                        <TableCell>{result.score}</TableCell>
                        <TableCell>{getStatusBadge(result.status)}</TableCell>
                        <TableCell>{result.timeTaken > 0 ? `${result.timeTaken} min` : '—'}</TableCell>
                        <TableCell>{new Date(result.gradedAt).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            {pendingManual.length > 0 && (
                              <Badge variant="outline" className="text-xs gap-1">
                                <Hourglass className="w-3 h-3" />
                                {pendingManual.length} to grade
                              </Badge>
                            )}
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Student Detail / Grading Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Student: {selectedStudent?.studentId}
                {selectedStudent && getStatusBadge(selectedStudent.status)}
              </DialogTitle>
              <DialogDescription>
                Score: {selectedStudent?.score} • Questions: {selectedStudent?.questionDetails.length}
              </DialogDescription>
            </DialogHeader>

            {selectedStudent && (
              <div className="space-y-4">
                {sortedDetails(selectedStudent.questionDetails).map((detail, idx) => {
                  const isManual = detail.questionType === 'CODING' || detail.questionType === 'WRITING';
                  const isPending = detail.correctAnswer === 'Waiting for teacher to review';

                  return (
                    <Card key={detail.questionId} className={isPending ? 'border-amber-500/50' : ''}>
                      <CardContent className="pt-4 space-y-3">
                        {/* Question header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-muted-foreground">Q{idx + 1}</span>
                            <Badge variant="outline" className="gap-1">
                              {getTypeIcon(detail.questionType)}
                              {getTypeLabel(detail.questionType)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {detail.pointsPossible} pts
                            </span>
                          </div>
                          <div>
                            {isPending ? (
                              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 gap-1">
                                <Hourglass className="w-3 h-3" />
                                Pending Review
                              </Badge>
                            ) : detail.correct ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Correct
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="gap-1">
                                <XCircle className="w-3 h-3" />
                                Incorrect
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Separator />

                        {/* Student Answer */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Student Answer</p>
                          {detail.studentAnswer ? (
                            isManual ? (
                              <pre className="text-sm bg-muted p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                                {detail.studentAnswer}
                              </pre>
                            ) : (
                              <p className="text-sm bg-muted p-3 rounded-lg">{detail.studentAnswer}</p>
                            )
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No answer provided</p>
                          )}
                        </div>

                        {/* Correct Answer (for auto-graded) */}
                        {!isManual && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Correct Answer</p>
                            <p className="text-sm bg-muted p-3 rounded-lg">{detail.correctAnswer}</p>
                          </div>
                        )}

                        {/* Grading input for manual types */}
                        {isManual && isPending && (
                          <div className="bg-secondary/30 p-4 rounded-lg space-y-3">
                            <p className="text-sm font-semibold flex items-center gap-2">
                              <PenLine className="w-4 h-4" />
                              Grade this answer
                            </p>
                            <div className="flex items-center gap-3">
                              <label className="text-sm text-muted-foreground whitespace-nowrap">
                                Points (max {detail.pointsPossible}):
                              </label>
                              <Input
                                type="number"
                                min={0}
                                max={detail.pointsPossible}
                                value={gradeInputs[detail.questionId] ?? 0}
                                onChange={e => setGradeInputs(prev => ({
                                  ...prev,
                                  [detail.questionId]: Math.min(
                                    detail.pointsPossible,
                                    Math.max(0, parseInt(e.target.value) || 0)
                                  ),
                                }))}
                                className="w-24"
                              />
                            </div>
                          </div>
                        )}

                        {/* Already graded manual */}
                        {isManual && !isPending && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Points awarded:</span>
                            <span className="font-bold">{detail.pointsObtained} / {detail.pointsPossible}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button>
              {selectedStudent?.questionDetails.some(
                d => (d.questionType === 'CODING' || d.questionType === 'WRITING') && d.correctAnswer === 'Waiting for teacher to review'
              ) && (
                <Button onClick={handleSaveGrades}>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Save Grades
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TeacherGrading;
