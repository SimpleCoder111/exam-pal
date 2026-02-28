import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Home, RotateCcw, Trophy, Target } from "lucide-react";
import StrengthMap from "@/components/exam/StrengthMap";
import type { Question } from "@/pages/Exam";

interface ResultsState {
  score: number;
  total: number;
  answers: Record<number, number>;
  questions: Question[];
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
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { score, total, answers, questions } = state;
  const percentage = Math.round((score / total) * 100);
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: "A", color: "text-success" };
    if (percentage >= 80) return { grade: "B", color: "text-primary" };
    if (percentage >= 70) return { grade: "C", color: "text-accent-foreground" };
    if (percentage >= 60) return { grade: "D", color: "text-muted-foreground" };
    return { grade: "F", color: "text-destructive" };
  };

  const { grade, color } = getGrade();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
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
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-success" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Exam Completed!
          </h1>
          <p className="text-muted-foreground mb-8">Here's your performance summary</p>

          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mb-8">
            <div>
              <div className="font-heading text-4xl font-bold text-foreground">{score}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div>
              <div className={`font-heading text-4xl font-bold ${color}`}>{grade}</div>
              <div className="text-sm text-muted-foreground">Grade</div>
            </div>
            <div>
              <div className="font-heading text-4xl font-bold text-foreground">{percentage}%</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/exam">
              <Button variant="default" size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Exam
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Strength Map */}
        <StrengthMap questions={questions} answers={answers} />

        {/* Detailed Results */}
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
            Answer Review
          </h2>
          <div className="space-y-4">
            {questions.map((q, index) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`bg-card rounded-xl p-6 border-2 transition-all animate-slide-up ${
                    isCorrect ? "border-success/30" : "border-destructive/30"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCorrect ? "bg-success/10" : "bg-destructive/10"
                    }`}>
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-3">
                        {index + 1}. {q.question}
                      </p>
                      <div className="grid gap-2">
                        {q.options.map((option, optIndex) => {
                          const isUserAnswer = optIndex === userAnswer;
                          const isCorrectAnswer = optIndex === q.correctAnswer;

                          let optionClass = "bg-secondary/50 text-muted-foreground";
                          if (isCorrectAnswer) {
                            optionClass = "bg-success/10 text-success border border-success/30";
                          } else if (isUserAnswer && !isCorrect) {
                            optionClass = "bg-destructive/10 text-destructive border border-destructive/30";
                          }

                          return (
                            <div
                              key={optIndex}
                              className={`px-4 py-2 rounded-lg text-sm ${optionClass}`}
                            >
                              {option}
                              {isCorrectAnswer && <span className="ml-2 text-xs">(Correct)</span>}
                              {isUserAnswer && !isCorrect && <span className="ml-2 text-xs">(Your answer)</span>}
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
      </main>
    </div>
  );
};

export default Results;
