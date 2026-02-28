import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Home, Trophy, Target, Clock, Award } from "lucide-react";
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
}

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
  } = state;

  const percentage = totalPossibleScore > 0
    ? Math.round((obtainedScore / totalPossibleScore) * 100)
    : 0;

  const getGrade = () => {
    if (percentage >= 90) return { grade: "A", color: "text-green-500" };
    if (percentage >= 80) return { grade: "B", color: "text-primary" };
    if (percentage >= 70) return { grade: "C", color: "text-accent-foreground" };
    if (percentage >= 60) return { grade: "D", color: "text-muted-foreground" };
    return { grade: "F", color: "text-destructive" };
  };

  const { grade, color } = getGrade();

  const formattedDate = submittedAt
    ? new Date(submittedAt).toLocaleString()
    : "—";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/student" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-semibold text-foreground">ExamFlow</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Score Card */}
        <div className="bg-card rounded-2xl shadow-elevated p-8 md:p-12 text-center mb-12 animate-scale-in">
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
            <p className="text-sm text-destructive font-medium mb-4">⚠ Submitted late</p>
          )}
          <p className="text-xs text-muted-foreground mb-8">
            <Clock className="w-3 h-3 inline mr-1" />
            Submitted at {formattedDate}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-lg mx-auto mb-8">
            <div>
              <div className="font-heading text-3xl font-bold text-foreground">{obtainedScore}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-bold text-muted-foreground">{totalPossibleScore}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div>
              <div className={`font-heading text-3xl font-bold ${color}`}>{grade}</div>
              <div className="text-sm text-muted-foreground">Grade</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-bold text-foreground">{percentage}%</div>
              <div className="text-sm text-muted-foreground">Percentage</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
            <Award className="w-4 h-4" />
            <span>{answeredCount} of {totalQuestions} questions answered</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg" onClick={() => navigate("/student/exams")}>
              <Home className="w-4 h-4 mr-2" />
              Back to Exams
            </Button>
          </div>
        </div>

        {/* Question Review */}
        {questions && questions.length > 0 && (
          <div>
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
              Answer Review
            </h2>
            <div className="space-y-4">
              {questions.map((q, index) => {
                const userAnswer = answers[q.id];

                return (
                  <div
                    key={q.id}
                    className="bg-card rounded-xl p-6 border border-border transition-all animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-sm font-medium text-foreground">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground mb-3">{q.question}</p>
                        <div className="grid gap-2">
                          {q.options.map((option, optIndex) => {
                            const isUserAnswer = optIndex === userAnswer;

                            return (
                              <div
                                key={optIndex}
                                className={`px-4 py-2 rounded-lg text-sm ${
                                  isUserAnswer
                                    ? "bg-primary/10 text-primary border border-primary/30 font-medium"
                                    : "bg-secondary/50 text-muted-foreground"
                                }`}
                              >
                                {option}
                                {isUserAnswer && <span className="ml-2 text-xs">(Your answer)</span>}
                              </div>
                            );
                          })}
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
