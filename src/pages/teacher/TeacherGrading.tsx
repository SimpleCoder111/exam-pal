import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient, useQueries } from '@tanstack/react-query';
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
import {
  useTeacherExamResults,
  useTeacherGradingDetails,
  type ExamResultListItem,
  type GradingDetail,
  type GradingDetailsData,
} from '@/hooks/useTeacherResults';
import { useTeacherExams } from '@/hooks/useTeacherExams';
import { useTeacherSubjects } from '@/hooks/useTeacherSubjects';
import { useAuth } from '@/contexts/AuthContext';
import { apiPost, apiPut, apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
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
  Sparkles,
  Loader2,
  Save,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
} from 'lucide-react';

const RUBRIC_OPTIONS = [
  { value: 'IELTS Writing Standard', label: 'IELTS' },
  { value: 'TOEFL Writing Standard', label: 'TOEFL' },
  { value: 'Cambridge English Assessment', label: 'Cambridge' },
  { value: 'General Essay Rubric', label: 'General' },
  { value: 'Custom', label: 'Custom' },
];

const formatTimeTaken = (ms: number): string => {
  if (!ms || ms === 0) return '—';
  const absMs = Math.abs(ms);
  const totalSeconds = Math.floor(absMs / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const millis = absMs % 1000;
  const sign = ms < 0 ? '-' : '';
  return `${sign}${h}h ${String(m).padStart(2, '0')}mn ${String(s).padStart(2, '0')}.${String(millis).padStart(3, '0')}s`;
};

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

const getDifficultyBadge = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY':
      return <Badge variant="outline" className="text-green-600 border-green-300 dark:text-green-400">Easy</Badge>;
    case 'MEDIUM':
      return <Badge variant="outline" className="text-amber-600 border-amber-300 dark:text-amber-400">Medium</Badge>;
    case 'HARD':
      return <Badge variant="outline" className="text-red-600 border-red-300 dark:text-red-400">Hard</Badge>;
    default:
      return <Badge variant="outline">{difficulty}</Badge>;
  }
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

const getGradeBadge = (grade: string) => {
  if (!grade || grade === 'PENDING') {
    return <Badge variant="outline" className="text-amber-600 border-amber-300">Pending</Badge>;
  }
  const colorMap: Record<string, string> = {
    'A': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'B': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'C': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    'D': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    'F': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  };
  return <Badge className={colorMap[grade] || ''}>{grade}</Badge>;
};

const TeacherGrading = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const examId = searchParams.get('examId') ? parseInt(searchParams.get('examId')!) : null;
  const examTitle = searchParams.get('title') || 'Exam Results';

  const { data: exams, isLoading: examsLoading } = useTeacherExams();
  const { data: teacherSubjects } = useTeacherSubjects();
  const { data: results, isLoading, error } = useTeacherExamResults(examId);

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const { data: gradingDetails, isLoading: detailsLoading } = useTeacherGradingDetails(
    showDetailDialog ? examId : null,
    showDetailDialog ? selectedStudentId : null
  );

  const [gradeInputs, setGradeInputs] = useState<Record<number, number>>({});
  const [summaryInputs, setSummaryInputs] = useState<Record<number, string>>({});
  const [correctAnswerInputs, setCorrectAnswerInputs] = useState<Record<number, string>>({});
  const [studentSearch, setStudentSearch] = useState('');
  const [examSearch, setExamSearch] = useState('');
  const [aiLoading, setAiLoading] = useState<Record<number, boolean>>({});
  const [aiSuggestions, setAiSuggestions] = useState<Record<number, { score: number; message: string; suggestion?: string }>>({});
  const [saving, setSaving] = useState(false);
  const [rubricSelections, setRubricSelections] = useState<Record<number, string>>({});
  const [customRubrics, setCustomRubrics] = useState<Record<number, string>>({});
  const [suggestionInputs, setSuggestionInputs] = useState<Record<number, string>>({});

  // Pre-fill inputs when grading details load
  useEffect(() => {
    if (gradingDetails?.details) {
      const points: Record<number, number> = {};
      const summaries: Record<number, string> = {};
      const corrects: Record<number, string> = {};
      const suggestions: Record<number, string> = {};
      gradingDetails.details.forEach(d => {
        points[d.questionId] = d.pointsObtained;
        summaries[d.questionId] = d.summaryMessage || '';
        const isManualType = d.questionType === 'CODING' || d.questionType === 'WRITING';
        corrects[d.questionId] = (isManualType && d.correctAnswer === 'N/A') ? '' : (d.correctAnswer || '');
        suggestions[d.questionId] = d.suggestionForImprovement || '';
      });
      setGradeInputs(points);
      setSummaryInputs(summaries);
      setCorrectAnswerInputs(corrects);
      setSuggestionInputs(suggestions);
    }
  }, [gradingDetails]);

  const filteredResults = results?.filter(r =>
    !studentSearch || r.studentId.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredExams = exams?.filter(e =>
    !examSearch || e.examTitle.toLowerCase().includes(examSearch.toLowerCase())
  );

  const openStudentDetail = (result: ExamResultListItem) => {
    setSelectedStudentId(result.studentId);
    setGradeInputs({});
    setSummaryInputs({});
    setCorrectAnswerInputs({});
    setAiSuggestions({});
    setSuggestionInputs({});
    setRubricSelections({});
    setCustomRubrics({});
    setShowDetailDialog(true);
  };

  const currentDetails = gradingDetails?.details || [];
  const sortedDetails = [...currentDetails].sort((a, b) => {
    const ai = QUESTION_TYPE_ORDER.indexOf(a.questionType);
    const bi = QUESTION_TYPE_ORDER.indexOf(b.questionType);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const handleAiGrade = useCallback(async (detail: GradingDetail) => {
    if (!detail.studentAnswer || !accessToken) return;

    setAiLoading(prev => ({ ...prev, [detail.questionId]: true }));
    try {
      interface AiGradeResponse {
        obtainedScore: number;
        totalPossibleScore: number;
        summaryMessage: string;
        suggestionForImprovement?: string;
      }

      let res: AiGradeResponse;

      if (detail.questionType === 'WRITING') {
        const selectedRubric = rubricSelections[detail.questionId] || 'General Essay Rubric';
        const rubric = selectedRubric === 'Custom'
          ? (customRubrics[detail.questionId] || 'General Essay Rubric')
          : selectedRubric;

        res = await apiPost<AiGradeResponse>(
          '/api/v1/ai/grade-essay',
          accessToken,
          {
            rubric,
            essayTitle: detail.questionContent,
            essay: detail.studentAnswer,
          }
        );
      } else {
        res = await apiPost<AiGradeResponse>(
          '/api/v1/ai/grade-code',
          accessToken,
          {
            problemDesc: `Question (${detail.pointsPossible} points): ${detail.questionContent}`,
            code: detail.studentAnswer,
          }
        );
      }

      const suggestedScore = Math.round((res.obtainedScore / res.totalPossibleScore) * detail.pointsPossible);
      const clampedScore = Math.min(detail.pointsPossible, Math.max(0, suggestedScore));

      setAiSuggestions(prev => ({
        ...prev,
        [detail.questionId]: { score: clampedScore, message: res.summaryMessage, suggestion: res.suggestionForImprovement },
      }));
      setGradeInputs(prev => ({ ...prev, [detail.questionId]: clampedScore }));
      setSummaryInputs(prev => ({ ...prev, [detail.questionId]: res.summaryMessage }));
      if (res.suggestionForImprovement) {
        setSuggestionInputs(prev => ({ ...prev, [detail.questionId]: res.suggestionForImprovement! }));
      }

      toast({
        title: 'AI Suggestion Ready',
        description: `Suggested ${clampedScore}/${detail.pointsPossible} points`,
      });
    } catch {
      toast({
        title: 'AI Grading Failed',
        description: 'Could not get AI suggestion. Please grade manually.',
        variant: 'destructive',
      });
    } finally {
      setAiLoading(prev => ({ ...prev, [detail.questionId]: false }));
    }
  }, [accessToken, toast, rubricSelections, customRubrics]);

  const handleSaveGrades = useCallback(async () => {
    if (!gradingDetails || !accessToken) return;

    setSaving(true);
    try {
      // Build the payload matching the PUT API format
      const updatedDetails = gradingDetails.details.map(d => {
        const wasEdited = (
          (gradeInputs[d.questionId] ?? d.pointsObtained) !== d.pointsObtained ||
          (summaryInputs[d.questionId] ?? d.summaryMessage) !== d.summaryMessage ||
          (correctAnswerInputs[d.questionId] ?? d.correctAnswer) !== d.correctAnswer ||
          (suggestionInputs[d.questionId] ?? (d.suggestionForImprovement || '')) !== (d.suggestionForImprovement || '')
        );

        return {
          questionId: d.questionId,
          questionType: d.questionType,
          questionContent: d.questionContent,
          questionDifficulty: d.questionDifficulty,
          pointsPossible: d.pointsPossible,
          pointsObtained: gradeInputs[d.questionId] ?? d.pointsObtained,
          summaryMessage: summaryInputs[d.questionId] ?? d.summaryMessage,
          suggestionForImprovement: suggestionInputs[d.questionId] ?? (d.suggestionForImprovement || ''),
          studentAnswer: d.studentAnswer,
          correctAnswer: correctAnswerInputs[d.questionId] ?? d.correctAnswer,
          chapterId: d.chapterId,
          chapterTitle: d.chapterTitle,
          scoreEdit: wasEdited || d.scoreEdit,
          correct: d.correct,
          score: d.score,
        };
      });

      const payload: GradingDetailsData = {
        id: gradingDetails.id,
        examId: gradingDetails.examId,
        examName: gradingDetails.examName,
        classId: gradingDetails.classId,
        studentId: gradingDetails.studentId,
        grade: gradingDetails.grade,
        score: updatedDetails.reduce((sum, d) => sum + d.pointsObtained, 0),
        status: gradingDetails.status,
        timeTaken: gradingDetails.timeTaken,
        gradedAt: gradingDetails.gradedAt,
        details: updatedDetails,
      };

      await apiPut(
        '/api/v1/teacher/result/grade-student',
        accessToken,
        payload
      );

      toast({
        title: 'Grades Saved Successfully',
        description: 'Student grades have been submitted to the server.',
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['teacherExamResults', examId] });
      queryClient.invalidateQueries({ queryKey: ['teacherGradingDetails', examId, selectedStudentId] });

      setShowDetailDialog(false);
    } catch (err) {
      toast({
        title: 'Failed to Save Grades',
        description: 'An error occurred while saving. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }, [gradingDetails, accessToken, gradeInputs, summaryInputs, correctAnswerInputs, suggestionInputs, examId, selectedStudentId, queryClient, toast]);

  const pendingCount = results?.filter(r => r.status === 'PENDING_REVIEW').length || 0;
  const gradedCount = results?.filter(r => r.status === 'GRADED').length || 0;

  // Fetch grading details for all graded students to aggregate chapter performance
  const gradedStudents = useMemo(() => results?.filter(r => r.status === 'GRADED') || [], [results]);
  const allGradingQueries = useQueries({
    queries: gradedStudents.map(student => ({
      queryKey: ['teacherGradingDetails', examId, student.studentId],
      queryFn: async () => {
        const res = await apiFetch<{ code: string; data: GradingDetailsData; message: string }>(
          `/api/v1/teacher/result/grading-details?examId=${examId}&studentId=${student.studentId}`,
          accessToken
        );
        return res.data;
      },
      enabled: !!examId && !!accessToken,
      staleTime: 5 * 60 * 1000,
    })),
  });

  // Find the subject for the current exam to get all chapters
  const currentExam = useMemo(() => exams?.find(e => (e.examId || e.id) === examId), [exams, examId]);
  const currentSubject = useMemo(() => {
    if (!currentExam || !teacherSubjects) return null;
    return teacherSubjects.find(s => s.id === currentExam.subjectId) || null;
  }, [currentExam, teacherSubjects]);

  const aggregatedChapters = useMemo(() => {
    const chapterMap = new Map<number, { title: string; obtained: number; possible: number; correct: number; total: number; orderIndex: number }>();

    // First, populate from all subject chapters (even those not in the exam)
    if (currentSubject?.chapterResponseList) {
      currentSubject.chapterResponseList.forEach(ch => {
        chapterMap.set(ch.id, {
          title: ch.name,
          obtained: 0,
          possible: 0,
          correct: 0,
          total: 0,
          orderIndex: ch.orderIndex,
        });
      });
    }

    // Then aggregate from grading data
    allGradingQueries.forEach(q => {
      if (q.data?.details) {
        q.data.details.forEach(d => {
          const existing = chapterMap.get(d.chapterId);
          if (existing) {
            existing.obtained += d.pointsObtained;
            existing.possible += d.pointsPossible;
            existing.total += 1;
            if (d.correct) existing.correct += 1;
          } else {
            chapterMap.set(d.chapterId, {
              title: d.chapterTitle,
              obtained: d.pointsObtained,
              possible: d.pointsPossible,
              total: 1,
              correct: d.correct ? 1 : 0,
              orderIndex: 999,
            });
          }
        });
      }
    });
    return Array.from(chapterMap.entries())
      .map(([id, ch]) => ({ id, ...ch, percentage: ch.possible > 0 ? Math.round((ch.obtained / ch.possible) * 100) : 0 }))
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }, [allGradingQueries, currentSubject]);

  // Loaded when there are no graded students (nothing to fetch) OR all per-student fetches resolved
  const allGradingLoaded = allGradingQueries.length === 0 || allGradingQueries.every(q => !q.isLoading);

  return (
    <DashboardLayout navItems={teacherNavItems} role="teacher">
      <div className="space-y-6">
        {!examId ? (
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Select an Exam to Grade</CardTitle>
                  <CardDescription>Choose an exam to view student submissions and grade answers</CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exams..."
                    value={examSearch}
                    onChange={e => setExamSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {examsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : !filteredExams?.length ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {examSearch ? `No exams matching "${examSearch}"` : 'No exams found.'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExams.map(exam => {
                      const examDate = new Date(exam.examDate);
                      const now = new Date();
                      const endTime = new Date(examDate.getTime() + (exam.duration || 0) * 60000);
                      let examStatus: 'upcoming' | 'ongoing' | 'completed';
                      if (now < examDate) examStatus = 'upcoming';
                      else if (now <= endTime) examStatus = 'ongoing';
                      else examStatus = 'completed';

                      return (
                        <TableRow
                          key={exam.examId || exam.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSearchParams({ examId: String(exam.examId || exam.id), title: exam.examTitle })}
                        >
                          <TableCell className="font-medium">{exam.examTitle}</TableCell>
                          <TableCell>{examDate.toLocaleDateString()}</TableCell>
                          <TableCell>{exam.duration} min</TableCell>
                          <TableCell>
                            {examStatus === 'upcoming' && (
                              <Badge variant="outline" className="border-blue-300 text-blue-600 dark:text-blue-400">Upcoming</Badge>
                            )}
                            {examStatus === 'ongoing' && (
                              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Ongoing</Badge>
                            )}
                            {examStatus === 'completed' && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Completed</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Eye className="h-4 w-4" />
                              View Results
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setSearchParams({})}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{examTitle}</h1>
                <p className="text-muted-foreground">View student submissions and grade answers</p>
              </div>
            </div>

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

            {/* Class Average Strength Map — aligned with student StrengthMap style */}
            {allGradingLoaded && aggregatedChapters.length > 0 && (
              <div className="bg-card rounded-2xl shadow-elevated p-8 animate-scale-in">
                <div className="mb-8">
                  <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                    Class Strength Map
                  </h2>
                  <p className="text-muted-foreground">
                    Average chapter performance across {gradedStudents.length} graded student{gradedStudents.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {aggregatedChapters.map((ch, idx) => {
                    const notInExam = ch.total === 0;
                    const cardColor = notInExam
                      ? "bg-muted/30 text-muted-foreground border-border opacity-70"
                      : ch.percentage >= 80
                      ? "bg-green-500/10 text-green-700 border-green-500/20"
                      : ch.percentage >= 50
                      ? "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
                      : "bg-red-500/10 text-red-700 border-red-500/20";
                    const trendIcon = notInExam ? (
                      <Minus className="w-5 h-5 text-muted-foreground" />
                    ) : ch.percentage >= 80 ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : ch.percentage >= 50 ? (
                      <Minus className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    );
                    const label = notInExam
                      ? "Not Tested"
                      : ch.percentage >= 80
                      ? "Strong"
                      : ch.percentage >= 50
                      ? "Moderate"
                      : "Weak";

                    return (
                      <div
                        key={ch.id}
                        className={`rounded-xl p-6 border-2 transition-all hover:shadow-md ${cardColor}`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium opacity-75 mb-0.5">Chapter {idx + 1}</p>
                            <h3 className="font-semibold text-sm truncate pr-2">
                              {ch.title}
                            </h3>
                            <p className="text-xs opacity-75 mt-1">
                              {notInExam
                                ? "Not in this exam"
                                : `${ch.correct} of ${ch.total} • ${ch.obtained}/${ch.possible} pts`}
                            </p>
                          </div>
                          {trendIcon}
                        </div>

                        {/* Percentage */}
                        <div className="text-center mb-4">
                          <div className="font-heading text-3xl font-bold">
                            {notInExam ? "—" : `${ch.percentage}%`}
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <Progress value={notInExam ? 0 : ch.percentage} className="h-2" />
                          <div className="flex justify-between text-xs">
                            <span>Class Avg</span>
                            <span className="opacity-75">{label}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Statistics */}
                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4">Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <div className="font-heading text-2xl font-bold text-foreground">
                        {aggregatedChapters.length}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Total Chapters
                      </div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-4 text-center">
                      <div className="font-heading text-2xl font-bold text-green-600">
                        {aggregatedChapters.filter(c => c.total > 0 && c.percentage >= 80).length}
                      </div>
                      <div className="text-xs text-green-700 mt-1">Strong Topics</div>
                    </div>
                    <div className="bg-yellow-500/10 rounded-lg p-4 text-center">
                      <div className="font-heading text-2xl font-bold text-yellow-600">
                        {aggregatedChapters.filter(c => c.total > 0 && c.percentage >= 50 && c.percentage < 80).length}
                      </div>
                      <div className="text-xs text-yellow-700 mt-1">Moderate Topics</div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-4 text-center">
                      <div className="font-heading text-2xl font-bold text-red-600">
                        {aggregatedChapters.filter(c => c.total > 0 && c.percentage < 50).length}
                      </div>
                      <div className="text-xs text-red-700 mt-1">Areas to Improve</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                        <TableHead>Student Name</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time Taken</TableHead>
                        <TableHead>Graded At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResults.map(result => (
                        <TableRow
                          key={result.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => openStudentDetail(result)}
                        >
                          <TableCell className="font-medium">{result.studentId}</TableCell>
                          <TableCell>{result.studentName || '—'}</TableCell>
                          <TableCell>{result.score}</TableCell>
                          <TableCell>{getGradeBadge(result.grade)}</TableCell>
                          <TableCell>{getStatusBadge(result.status)}</TableCell>
                          <TableCell>{formatTimeTaken(result.timeTaken)}</TableCell>
                          <TableCell>{new Date(result.gradedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} {new Date(result.gradedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" title={result.status === 'GRADED' ? 'View grades' : 'Grade student'}>
                              {result.status === 'GRADED' ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <PenLine className="h-4 w-4 text-amber-600" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Student Detail / Grading Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={open => {
              setShowDetailDialog(open);
              if (!open) setSelectedStudentId(null);
            }}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 flex-wrap">
                    Student: {gradingDetails?.studentId || selectedStudentId}
                    {gradingDetails && getStatusBadge(gradingDetails.status)}
                    {gradingDetails && getGradeBadge(gradingDetails.grade)}
                  </DialogTitle>
                  <DialogDescription>
                    {gradingDetails
                      ? `${gradingDetails.examName} • Score: ${gradingDetails.score} • ${gradingDetails.details.length} Questions`
                      : 'Loading grading details...'}
                  </DialogDescription>
                </DialogHeader>

                {detailsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                  </div>
                ) : gradingDetails ? (
                  <div className="space-y-4">
                    {/* Chapter Strength & Weakness Map */}
                    {(() => {
                      const chapterMap = new Map<number, { title: string; obtained: number; possible: number; correct: number; total: number; orderIndex: number }>();
                      // Pre-populate all subject chapters
                      if (currentSubject?.chapterResponseList) {
                        currentSubject.chapterResponseList.forEach(ch => {
                          chapterMap.set(ch.id, { title: ch.name, obtained: 0, possible: 0, correct: 0, total: 0, orderIndex: ch.orderIndex });
                        });
                      }
                      gradingDetails.details.forEach(d => {
                        const existing = chapterMap.get(d.chapterId);
                        if (existing) {
                          existing.obtained += d.pointsObtained;
                          existing.possible += d.pointsPossible;
                          existing.total += 1;
                          if (d.correct) existing.correct += 1;
                        } else {
                          chapterMap.set(d.chapterId, { title: d.chapterTitle, obtained: d.pointsObtained, possible: d.pointsPossible, total: 1, correct: d.correct ? 1 : 0, orderIndex: 999 });
                        }
                      });
                      const chapters = Array.from(chapterMap.entries())
                        .map(([id, ch]) => ({ id, ...ch, percentage: ch.possible > 0 ? Math.round((ch.obtained / ch.possible) * 100) : 0 }))
                        .sort((a, b) => a.orderIndex - b.orderIndex);

                      return chapters.length > 0 ? (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <BarChart3 className="w-5 h-5 text-primary" />
                              Chapter Strength & Weakness
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {chapters.map((ch, idx) => {
                                const notInExam = ch.total === 0;
                                return (
                                  <div
                                    key={ch.id}
                                    className={`rounded-xl border p-4 transition-all ${
                                      notInExam
                                        ? 'border-border bg-muted/30 opacity-60'
                                        : ch.percentage >= 80
                                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                                        : ch.percentage >= 50
                                        ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'
                                        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground mb-0.5">Chapter {idx + 1}</p>
                                        <h4 className="font-semibold text-sm text-foreground truncate">{ch.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                          {notInExam ? 'Not in this exam' : `${ch.correct}/${ch.total} questions • ${ch.obtained}/${ch.possible} pts`}
                                        </p>
                                      </div>
                                      {notInExam ? (
                                        <Minus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                      ) : ch.percentage >= 80 ? (
                                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                      ) : ch.percentage >= 50 ? (
                                        <Minus className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                      ) : (
                                        <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                                      )}
                                    </div>
                                    <div className="space-y-1.5">
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-lg text-foreground">{notInExam ? '—' : `${ch.percentage}%`}</span>
                                        <span className={`font-medium ${
                                          notInExam ? 'text-muted-foreground'
                                            : ch.percentage >= 80 ? 'text-green-600 dark:text-green-400'
                                            : ch.percentage >= 50 ? 'text-amber-600 dark:text-amber-400'
                                            : 'text-red-600 dark:text-red-400'
                                        }`}>
                                          {notInExam ? 'N/A' : ch.percentage >= 80 ? 'Strong' : ch.percentage >= 50 ? 'Moderate' : 'Weak'}
                                        </span>
                                      </div>
                                      <Progress value={notInExam ? 0 : ch.percentage} className="h-2" />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Summary row */}
                            <div className="grid grid-cols-4 gap-3 pt-2 border-t border-border">
                              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto mb-1" />
                                <div className="text-lg font-bold text-foreground">{chapters.filter(c => c.total > 0 && c.percentage >= 80).length}</div>
                                <div className="text-xs text-muted-foreground">Strong</div>
                              </div>
                              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
                                <Minus className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                                <div className="text-lg font-bold text-foreground">{chapters.filter(c => c.total > 0 && c.percentage >= 50 && c.percentage < 80).length}</div>
                                <div className="text-xs text-muted-foreground">Moderate</div>
                              </div>
                              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
                                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400 mx-auto mb-1" />
                                <div className="text-lg font-bold text-foreground">{chapters.filter(c => c.total > 0 && c.percentage < 50).length}</div>
                                <div className="text-xs text-muted-foreground">Weak</div>
                              </div>
                              <div className="bg-muted/30 rounded-lg p-3 text-center">
                                <Minus className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                                <div className="text-lg font-bold text-foreground">{chapters.filter(c => c.total === 0).length}</div>
                                <div className="text-xs text-muted-foreground">Not Tested</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : null;
                    })()}



                    {sortedDetails.map((detail, idx) => {
                      const isManual = detail.questionType === 'CODING' || detail.questionType === 'WRITING';
                      const isPending = detail.summaryMessage === 'Waiting for teacher to review';
                      const noAnswer = !detail.studentAnswer;

                      return (
                        <Card key={detail.questionId} className={isPending ? 'border-amber-500/50' : ''}>
                          <CardContent className="pt-4 space-y-3">
                            {/* Question header */}
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-muted-foreground">Q{idx + 1}</span>
                                <Badge variant="outline" className="gap-1">
                                  {getTypeIcon(detail.questionType)}
                                  {getTypeLabel(detail.questionType)}
                                </Badge>
                                {getDifficultyBadge(detail.questionDifficulty)}
                                <span className="text-xs text-muted-foreground">
                                  {detail.pointsPossible} pts
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {detail.scoreEdit && (
                                  <Badge variant="outline" className="text-blue-600 border-blue-300 dark:text-blue-400 gap-1">
                                    <PenLine className="w-3 h-3" />
                                    Edited
                                  </Badge>
                                )}
                                {isPending ? (
                                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 gap-1">
                                    <Hourglass className="w-3 h-3" />
                                    Pending Review
                                  </Badge>
                                ) : noAnswer && isManual ? (
                                  <Badge variant="secondary" className="gap-1">No Answer</Badge>
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

                            {/* Question content */}
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <p className="text-sm font-medium">{detail.questionContent}</p>
                            </div>

                            <Separator />

                            {/* Summary message */}
                            {detail.summaryMessage && detail.summaryMessage !== 'Waiting for teacher to review' && (
                              <div className="text-xs text-muted-foreground italic">
                                {detail.summaryMessage}
                              </div>
                            )}

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
                            {!isManual && detail.correctAnswer && detail.correctAnswer !== 'N/A' && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Correct Answer</p>
                                <p className="text-sm bg-muted p-3 rounded-lg">{detail.correctAnswer}</p>
                              </div>
                            )}

                            {/* Grading input for all question types */}
                            {(
                              <div className="bg-secondary/30 p-4 rounded-lg space-y-3">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <p className="text-sm font-semibold flex items-center gap-2">
                                    <PenLine className="w-4 h-4" />
                                    {isPending ? 'Grade this answer' : 'Edit grade'}
                                  </p>
                                  {isManual && detail.studentAnswer && (
                                    <div className="flex items-center gap-2">
                                      {detail.questionType === 'WRITING' && (
                                        <div className="flex items-center gap-2">
                                          <Select
                                            value={rubricSelections[detail.questionId] || 'General Essay Rubric'}
                                            onValueChange={val => setRubricSelections(prev => ({ ...prev, [detail.questionId]: val }))}
                                          >
                                            <SelectTrigger className="w-36 h-8 text-xs">
                                              <SelectValue placeholder="Rubric" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {RUBRIC_OPTIONS.map(r => (
                                                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        disabled={aiLoading[detail.questionId]}
                                        onClick={() => handleAiGrade(detail)}
                                      >
                                        {aiLoading[detail.questionId] ? (
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                          <Sparkles className="w-4 h-4" />
                                        )}
                                        {aiLoading[detail.questionId] ? 'Analyzing...' : 'AI Suggest'}
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                {/* Custom rubric input */}
                                {detail.questionType === 'WRITING' && rubricSelections[detail.questionId] === 'Custom' && (
                                  <div>
                                    <label className="text-sm text-muted-foreground">Custom Rubric</label>
                                    <Input
                                      placeholder="Enter your custom rubric criteria..."
                                      value={customRubrics[detail.questionId] ?? ''}
                                      onChange={e => setCustomRubrics(prev => ({ ...prev, [detail.questionId]: e.target.value }))}
                                      className="mt-1"
                                    />
                                  </div>
                                )}

                                {/* AI Suggestion feedback */}
                                {isManual && aiSuggestions[detail.questionId] && (
                                  <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                      <Sparkles className="w-4 h-4" />
                                      AI Suggestion: {aiSuggestions[detail.questionId].score}/{detail.pointsPossible} pts
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      {aiSuggestions[detail.questionId].message}
                                    </p>
                                    {aiSuggestions[detail.questionId].suggestion && (
                                      <div className="flex items-start gap-2 mt-2 pt-2 border-t border-primary/10">
                                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                          {aiSuggestions[detail.questionId].suggestion}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center gap-3">
                                  <label className="text-sm text-muted-foreground whitespace-nowrap">
                                    Points (max {detail.pointsPossible}):
                                  </label>
                                  <Input
                                    type="text"
                                    inputMode="numeric"
                                    value={gradeInputs[detail.questionId] === undefined ? '' : String(gradeInputs[detail.questionId])}
                                    onChange={e => {
                                      const raw = e.target.value.replace(/[^0-9]/g, '');
                                      if (raw === '') {
                                        setGradeInputs(prev => ({ ...prev, [detail.questionId]: undefined as any }));
                                        return;
                                      }
                                      const num = Math.min(detail.pointsPossible, Math.max(0, parseInt(raw)));
                                      setGradeInputs(prev => ({ ...prev, [detail.questionId]: num }));
                                    }}
                                    onBlur={() => {
                                      if (gradeInputs[detail.questionId] === undefined || isNaN(gradeInputs[detail.questionId])) {
                                        setGradeInputs(prev => ({ ...prev, [detail.questionId]: 0 }));
                                      }
                                    }}
                                    className="w-24"
                                  />
                                </div>

                                <div>
                                  <label className="text-sm text-muted-foreground">Summary / Feedback</label>
                                  <Textarea
                                    placeholder="Add feedback for the student..."
                                    value={summaryInputs[detail.questionId] ?? ''}
                                    onChange={e => setSummaryInputs(prev => ({
                                      ...prev,
                                      [detail.questionId]: e.target.value,
                                    }))}
                                    className="mt-1"
                                    rows={2}
                                  />
                                </div>

                                {/* Suggestion for Improvement (WRITING/CODING) or Correct Answer (others) */}
                                {(detail.questionType === 'WRITING' || detail.questionType === 'CODING') ? (
                                  <div>
                                    <label className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Lightbulb className="w-3.5 h-3.5" />
                                      Suggestion for Improvement
                                    </label>
                                    <Textarea
                                      placeholder="Provide suggestions for how the student can improve..."
                                      value={suggestionInputs[detail.questionId] ?? ''}
                                      onChange={e => setSuggestionInputs(prev => ({
                                        ...prev,
                                        [detail.questionId]: e.target.value,
                                      }))}
                                      className="mt-1"
                                      rows={3}
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <label className="text-sm text-muted-foreground">Correct Answer / Notes</label>
                                    <Textarea
                                      placeholder="Provide the correct answer or notes..."
                                      value={correctAnswerInputs[detail.questionId] ?? ''}
                                      onChange={e => setCorrectAnswerInputs(prev => ({
                                        ...prev,
                                        [detail.questionId]: e.target.value,
                                      }))}
                                      className="mt-1"
                                      rows={2}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-destructive py-8">Failed to load grading details.</p>
                )}

                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button>
                  {gradingDetails && (
                    <Button onClick={handleSaveGrades} disabled={saving}>
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {saving ? 'Saving...' : 'Save Grades'}
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherGrading;
