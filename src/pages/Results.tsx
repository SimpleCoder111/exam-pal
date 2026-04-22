import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Trophy, Target, Clock, Award, CheckCircle, XCircle, Hourglass, Code, PenLine, Type } from "lucide-react";
import type { QuestionGradeDetail } from "@/hooks/useSubmitExam";
import type { Question } from "@/pages/Exam";

interface ResultsState {
  obtainedScore: number;
  totalPossibleScore: number;
  answeredCount: number;
  totalQuestions: number;
  submittedAt: string;
  isLate: boolean;
  status: string;
  examSessionId: number;
  examTitle: string;
  subjectName: string;
  questions: Question[];
  answers: Record<number, number>;
  questionGradeDetails?: QuestionGradeDetail[];
}

const QUESTION_TYPE_ORDER: Record<string, number> = {
  MULTIPLE_CHOICE: 0,
  TRUE_FALSE: 1,
  FILL_IN_THE_BLANK: 2,
  CODING: 3,
  WRITING: 4,
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "MULTIPLE_CHOICE": return "Multiple Choice";
    case "TRUE_FALSE": return "True / False";
    case "FILL_IN_THE_BLANK": return "Fill in the Blank";
    case "CODING": return "Coding";
    case "WRITING": return "Writing";
    default: return type;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "CODING": return Code;
    case "WRITING": return PenLine;
    case "FILL_IN_THE_BLANK": return Type;
    default: return Target;
  }
};

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultsState | null;

  if (!state) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No results to display</p>
          <Link to="/student/exams">
            <Button>Back to Exams</Button>
          </Link>
        </div>
      </div>
    );
  }

  const {
    obtainedScore,
    totalPossibleScore,
    answeredCount,
    totalQuestions,
    submittedAt,
    isLate,
    examTitle,
    subjectName,
    questions,
    answers,
    questionGradeDetails = [],
  } = state;

  const formattedDate = submittedAt ? new Date(submittedAt).toLocaleString() : "—";

  const pendingReviewCount = questionGradeDetails.filter(
    (d) => d.questionType === "CODING" || d.questionType === "WRITING" || d.correctAnswer === "Waiting for teacher to review"
  ).length;

  const manualTypes = ["CODING", "WRITING"];
  const autoGraded = questionGradeDetails.filter((d) => !manualTypes.includes(d.questionType) && d.correctAnswer !== "Waiting for teacher to review");
  const correctCount = autoGraded.filter((d) => d.correct).length;
  const incorrectCount = autoGraded.filter((d) => !d.correct).length;

  // Sort grade details by question type order
  const sortedGradeDetails = [...questionGradeDetails].sort(
    (a, b) => (QUESTION_TYPE_ORDER[a.questionType] ?? 99) - (QUESTION_TYPE_ORDER[b.questionType] ?? 99)
  );

  // Find matching question text from the questions array
  const getQuestionText = (questionId: number) => {
    const q = questions.find((q) => q.id === questionId);
    return q?.question || `Question #${questionId}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/student" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-semibold text-foreground">ExamPal</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Score Card */}
        <div className="bg-card rounded-2xl shadow-elevated p-8 md:p-12 text-center mb-12 animate-scale-in border border-border">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-1">
            Exam Completed!
          </h1>
          <p className="text-muted-foreground mb-2">
            {examTitle} — {subjectName}
          </p>
          {isLate && (
            <Badge variant="destructive" className="mb-4">⚠ Submitted Late</Badge>
          )}
          <p className="text-xs text-muted-foreground mb-8">
            <Clock className="w-3 h-3 inline mr-1" />
            Submitted at {formattedDate}
          </p>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Award className="w-4 h-4 text-primary" />
              </div>
              <div className="font-heading text-2xl font-bold text-foreground">{answeredCount}/{totalQuestions}</div>
              <div className="text-xs text-muted-foreground">Answered</div>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="font-heading text-2xl font-bold text-foreground">{correctCount}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <XCircle className="w-4 h-4 text-destructive" />
              </div>
              <div className="font-heading text-2xl font-bold text-foreground">{incorrectCount}</div>
              <div className="text-xs text-muted-foreground">Incorrect</div>
            </div>
          </div>

          {pendingReviewCount > 0 && (
            <div className="bg-secondary/30 border border-border rounded-xl px-5 py-3 mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Hourglass className="w-4 h-4" />
              <span><strong className="text-foreground">{pendingReviewCount}</strong> question{pendingReviewCount > 1 ? 's' : ''} pending teacher review — final grade will be available after review</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg" onClick={() => navigate("/student/exams")}>
              <Home className="w-4 h-4 mr-2" />
              Back to Exams
            </Button>
          </div>
        </div>

        {/* Question-by-Question Review */}
        {sortedGradeDetails.length > 0 && (
          <div>
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
              Answer Review
            </h2>
            <div className="space-y-4">
              {sortedGradeDetails.map((detail, index) => {
                const isManualGradeType = detail.questionType === "CODING" || detail.questionType === "WRITING";
                const isPendingReview = isManualGradeType || detail.correctAnswer === "Waiting for teacher to review";
                const TypeIcon = getTypeIcon(detail.questionType);

                return (
                  <div
                    key={detail.questionId}
                    className="bg-card rounded-xl p-6 border border-border transition-all animate-slide-up"
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Status indicator */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isPendingReview
                          ? "bg-secondary"
                          : detail.correct
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-destructive/10"
                      }`}>
                        {isPendingReview ? (
                          <Hourglass className="w-5 h-5 text-muted-foreground" />
                        ) : detail.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Question header */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-muted-foreground">Q{index + 1}</span>
                          <Badge variant="outline" className="text-xs gap-1">
                            <TypeIcon className="w-3 h-3" />
                            {getTypeLabel(detail.questionType)}
                          </Badge>
                          {!isManualGradeType && (
                            <span className="text-xs ml-auto">
                              {detail.correct ? (
                                <span className="text-green-600 dark:text-green-400 font-medium">Correct</span>
                              ) : (
                                <span className="text-destructive font-medium">Incorrect</span>
                              )}
                            </span>
                          )}
                          {isManualGradeType && (
                            <span className="text-xs text-muted-foreground ml-auto font-medium">
                              Pending Review
                            </span>
                          )}
                        </div>

                        {/* Question text */}
                        <p className="font-medium text-foreground mb-3 text-sm">
                          {getQuestionText(detail.questionId)}
                        </p>

                        {/* Answer details */}
                        <div className="space-y-2">
                          {/* Student answer */}
                          <div className={`px-4 py-2.5 rounded-lg text-sm border ${
                            isPendingReview
                              ? "border-border bg-secondary/50"
                              : detail.correct
                              ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                              : "border-destructive/30 bg-destructive/5"
                          }`}>
                            <span className="text-xs font-medium text-muted-foreground block mb-1">
                              Your Answer
                            </span>
                            {detail.studentAnswer ? (
                              isManualGradeType ? (
                                <pre className="whitespace-pre-wrap text-foreground font-mono text-xs leading-relaxed">
                                  {detail.studentAnswer}
                                </pre>
                              ) : (
                                <span className="text-foreground">{detail.studentAnswer}</span>
                              )
                            ) : (
                              <span className="text-muted-foreground italic">No answer provided</span>
                            )}
                          </div>

                          {/* Status or correct answer */}
                          {isPendingReview ? (
                            <div className="px-4 py-2.5 rounded-lg text-sm border border-border bg-secondary/30">
                              <span className="text-xs font-medium text-muted-foreground block mb-1">
                                Status
                              </span>
                              <span className="text-muted-foreground flex items-center gap-1.5">
                                <Hourglass className="w-3.5 h-3.5" />
                                Waiting for teacher to review
                              </span>
                            </div>
                          ) : !detail.correct && !isManualGradeType ? (
                            <div className="px-4 py-2.5 rounded-lg text-sm border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                              <span className="text-xs font-medium text-muted-foreground block mb-1">
                                Correct Answer
                              </span>
                              <span className="text-foreground">{detail.correctAnswer}</span>
                            </div>
                          ) : null}

                          {/* Suggestion for improvement (CODING/WRITING) */}
                          {isManualGradeType && !isPendingReview && detail.suggestionForImprovement && (
                            <div className="px-4 py-2.5 rounded-lg text-sm border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                              <span className="text-xs font-medium text-muted-foreground block mb-1">
                                💡 Suggestion for Improvement
                              </span>
                              <span className="text-foreground">{detail.suggestionForImprovement}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Results;
