import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trophy, Target, BookOpen, TrendingUp, Star, Calendar, Clock, Eye, CheckCircle2, Hourglass, ArrowLeft, Code, PenLine, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { studentNavItems } from '@/config/studentNavItems';
import { useStudentResults, useStudentGradingDetails, type StudentResultItem } from '@/hooks/useStudentResults';
import { useStudentExams } from '@/hooks/useStudentExams';
import { useAuth } from '@/contexts/AuthContext';

const QUESTION_TYPE_ORDER: Record<string, number> = {
  MULTIPLE_CHOICE: 0, TRUE_FALSE: 1, FILL_IN_THE_BLANK: 2, CODING: 3, WRITING: 4,
};

const getTypeLabel = (t: string) => {
  switch (t) {
    case 'MULTIPLE_CHOICE': return 'MCQ';
    case 'TRUE_FALSE': return 'T/F';
    case 'FILL_IN_THE_BLANK': return 'Fill';
    case 'CODING': return 'Code';
    case 'WRITING': return 'Writing';
    default: return t;
  }
};

const getTypeIcon = (t: string) => {
  switch (t) {
    case 'CODING': return Code;
    case 'WRITING': return PenLine;
    default: return Target;
  }
};

const getGradeColor = (grade: string) => {
  if (grade === 'A' || grade === 'A+') return 'text-green-600 dark:text-green-400';
  if (grade === 'B' || grade === 'B+') return 'text-primary';
  if (grade === 'C' || grade === 'C+') return 'text-amber-600 dark:text-amber-400';
  if (grade === 'PENDING') return 'text-muted-foreground';
  if (grade === 'MISSING' || grade === 'N/A') return 'text-amber-600 dark:text-amber-400';
  return 'text-destructive';
};

const formatTimestamp = (iso: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const year = d.getFullYear();
  let hours = d.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${month}/${day}/${year} ${pad(hours)}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${ampm}`;
};

const formatTimeTaken = (ms: number): string => {
  if (!ms || ms === 0) return '—';
  const absMs = Math.abs(ms);
  const totalSeconds = Math.floor(absMs / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const millis = absMs % 1000;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}mn`);
  parts.push(`${s}.${millis.toString().padStart(3, '0')}s`);
  return parts.join(' ');
};

const StudentResultsReal = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterSubjectId = searchParams.get('subjectId');
  const filterSubjectName = searchParams.get('subjectName');
  const { data: allResults = [], isLoading, error } = useStudentResults();
  const { data: exams } = useStudentExams();
  const [selectedResult, setSelectedResult] = useState<StudentResultItem | null>(null);

  // Cross-reference: find examIds belonging to the filtered subject
  const subjectExamIds = filterSubjectId && exams
    ? exams.filter(e => String(e.subjectId) === filterSubjectId).map(e => String(e.examId))
    : null;
  const results = subjectExamIds
    ? allResults.filter(r => subjectExamIds.includes(String(r.examId)))
    : allResults;

  // Detail view
  const { data: gradingData, isLoading: detailsLoading } = useStudentGradingDetails(
    selectedResult?.examId ?? null,
    selectedResult?.studentId ?? null
  );

  if (selectedResult) {
    return (
      <DashboardLayout navItems={studentNavItems} role="student">
        <StudentResultDetail
          result={selectedResult}
          gradingData={gradingData}
          isLoading={detailsLoading}
          onBack={() => setSelectedResult(null)}
        />
      </DashboardLayout>
    );
  }

  const overallStats = (() => {
    if (results.length === 0) return { averageScore: 0, totalExams: 0, passRate: 0, improvement: 0 };
    const scores = results.map(r => r.score);
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const passRate = Math.round((scores.filter(s => s >= 50).length / scores.length) * 100);
    const improvement = scores.length >= 2 ? Math.round(scores[0] - scores[scores.length - 1]) : 0;
    return { averageScore, totalExams: results.length, passRate, improvement };
  })();

  return (
    <DashboardLayout navItems={studentNavItems} role="student">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">My Results</h1>
          <p className="text-muted-foreground mt-1">Track your exam performance and progress</p>
        </div>

        {filterSubjectName && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
              <BookOpen className="w-3.5 h-3.5" />
              Filtered by: {filterSubjectName}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setSearchParams({})}>
              Clear filter
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Average Score', value: overallStats.averageScore ? `${overallStats.averageScore}%` : '—', icon: Target },
            { label: 'Pass Rate', value: overallStats.passRate ? `${overallStats.passRate}%` : '—', icon: Trophy },
            { label: 'Exams Taken', value: overallStats.totalExams || '0', icon: BookOpen },
            { label: 'Improvement', value: overallStats.improvement ? `${overallStats.improvement > 0 ? '+' : ''}${overallStats.improvement}%` : '—', icon: TrendingUp },
          ].map(stat => (
            <Card key={stat.label} className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
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

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Exam Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
              </div>
            ) : error ? (
              <p className="text-sm text-destructive text-center py-8">Failed to load results. Please try again later.</p>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Trophy className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg">No Results Yet</h3>
                <p className="text-muted-foreground mt-1">Your exam results will appear here after you complete exams.</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Graded At</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map(result => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.examName}</TableCell>
                        <TableCell className="text-center font-bold">{result.score}</TableCell>
                        <TableCell className="text-center">
                          <span className={`font-bold ${getGradeColor(result.grade)}`}>{result.grade}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={result.status === 'GRADED' ? 'default' : 'secondary'} className="gap-1">
                            {result.status === 'GRADED' ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <Hourglass className="w-3 h-3" />
                            )}
                            {result.status === 'GRADED' ? 'Graded' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {formatTimestamp(result.gradedAt)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedResult(result)} title="View details">
                            <Eye className="h-4 w-4 text-primary" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// --- Detail View Component ---
interface StudentResultDetailProps {
  result: StudentResultItem;
  gradingData: import('@/hooks/useStudentResults').StudentGradingDetailsData | undefined;
  isLoading: boolean;
  onBack: () => void;
}

const StudentResultDetail = ({ result, gradingData, isLoading, onBack }: StudentResultDetailProps) => {
  if (isLoading || !gradingData) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Results
        </Button>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  const details = gradingData.details;
  const sorted = [...details].sort(
    (a, b) => (QUESTION_TYPE_ORDER[a.questionType] ?? 99) - (QUESTION_TYPE_ORDER[b.questionType] ?? 99)
  );

  const totalPossible = details.reduce((s, d) => s + d.pointsPossible, 0);
  const totalObtained = details.reduce((s, d) => s + d.pointsObtained, 0);
  const correctCount = details.filter(d => d.correct).length;
  const incorrectCount = details.filter(d => !d.correct && !['CODING', 'WRITING'].includes(d.questionType)).length;
  const pendingCount = details.filter(d => d.summaryMessage === 'Waiting for teacher to review').length;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Results
      </Button>

      {/* Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">{gradingData.examName}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatTimestamp(gradingData.gradedAt)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTimeTaken(gradingData.timeTaken)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">{totalObtained}/{totalPossible}</div>
                <div className="text-xs text-muted-foreground">Points</div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-center">
                <div className={`text-3xl font-bold ${getGradeColor(gradingData.grade)}`}>{gradingData.grade}</div>
                <div className="text-xs text-muted-foreground">Grade</div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <Badge variant={gradingData.status === 'GRADED' ? 'default' : 'secondary'} className="gap-1">
                {gradingData.status === 'GRADED' ? <CheckCircle2 className="w-3 h-3" /> : <Hourglass className="w-3 h-3" />}
                {gradingData.status === 'GRADED' ? 'Graded' : 'Pending Review'}
              </Badge>
            </div>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 max-w-md">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-foreground">{correctCount}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="bg-destructive/10 rounded-lg p-3 text-center">
              <XCircle className="w-4 h-4 text-destructive mx-auto mb-1" />
              <div className="text-lg font-bold text-foreground">{incorrectCount}</div>
              <div className="text-xs text-muted-foreground">Incorrect</div>
            </div>
            <div className="bg-secondary rounded-lg p-3 text-center">
              <Hourglass className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <div className="text-lg font-bold text-foreground">{pendingCount}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question-by-Question Review */}
      <div>
        <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Answer Review</h3>
        <div className="space-y-4">
          {sorted.map((detail, index) => {
            const isManual = detail.questionType === 'CODING' || detail.questionType === 'WRITING';
            const isPending = detail.summaryMessage === 'Waiting for teacher to review';
            const TypeIcon = getTypeIcon(detail.questionType);

            return (
              <Card key={detail.questionId} className="transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Status icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isPending ? 'bg-secondary' : detail.correct ? 'bg-green-100 dark:bg-green-900/30' : 'bg-destructive/10'
                    }`}>
                      {isPending ? (
                        <Hourglass className="w-5 h-5 text-muted-foreground" />
                      ) : detail.correct ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Q{index + 1}</span>
                        <Badge variant="outline" className="text-xs gap-1">
                          <TypeIcon className="w-3 h-3" />
                          {getTypeLabel(detail.questionType)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{detail.questionDifficulty}</Badge>
                        <span className="text-xs ml-auto font-medium">
                          <span className={detail.pointsObtained > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                            {detail.pointsObtained}
                          </span>
                          /{detail.pointsPossible} pts
                        </span>
                      </div>

                      {/* Question text */}
                      <p className="font-medium text-foreground mb-3 text-sm">{detail.questionContent}</p>

                      {/* Answers */}
                      <div className="space-y-2">
                        <div className={`px-4 py-2.5 rounded-lg text-sm border ${
                          isPending ? 'border-border bg-secondary/50'
                            : detail.correct ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                            : 'border-destructive/30 bg-destructive/5'
                        }`}>
                          <span className="text-xs font-medium text-muted-foreground block mb-1">Your Answer</span>
                          {detail.studentAnswer ? (
                            isManual ? (
                              <pre className="whitespace-pre-wrap text-foreground font-mono text-xs leading-relaxed">{detail.studentAnswer}</pre>
                            ) : (
                              <span className="text-foreground">{detail.studentAnswer}</span>
                            )
                          ) : (
                            <span className="text-muted-foreground italic">No answer provided</span>
                          )}
                        </div>

                        {isPending ? (
                          <div className="px-4 py-2.5 rounded-lg text-sm border border-border bg-secondary/30">
                            <span className="text-xs font-medium text-muted-foreground block mb-1">Status</span>
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              <Hourglass className="w-3.5 h-3.5" />
                              Waiting for teacher to review
                            </span>
                          </div>
                        ) : !detail.correct && detail.correctAnswer && !isManual ? (
                          <div className="px-4 py-2.5 rounded-lg text-sm border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                            <span className="text-xs font-medium text-muted-foreground block mb-1">Correct Answer</span>
                            <span className="text-foreground">{detail.correctAnswer}</span>
                          </div>
                        ) : null}

                        {/* Teacher feedback for graded manual questions */}
                        {isManual && !isPending && detail.summaryMessage && (
                          <div className="px-4 py-2.5 rounded-lg text-sm border border-primary/20 bg-primary/5">
                            <span className="text-xs font-medium text-muted-foreground block mb-1">Teacher Feedback</span>
                            <span className="text-foreground">{detail.summaryMessage}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentResultsReal;
