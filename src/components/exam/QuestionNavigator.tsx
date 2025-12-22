import { X, Flag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question } from "@/pages/Exam";

interface QuestionNavigatorProps {
  questions: Question[];
  answers: Record<number, number>;
  flagged: Set<number>;
  currentQuestion: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

const QuestionNavigator = ({
  questions,
  answers,
  flagged,
  currentQuestion,
  onSelect,
  onClose,
}: QuestionNavigatorProps) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-card shadow-elevated z-50 animate-slide-up">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            Question Navigator
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-secondary border border-border" />
              <span>Unanswered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-accent" />
              <span>Flagged</span>
            </div>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, index) => {
              const isAnswered = answers[q.id] !== undefined;
              const isFlagged = flagged.has(q.id);
              const isCurrent = currentQuestion === index;

              let bgClass = "bg-secondary hover:bg-secondary/80";
              if (isAnswered) bgClass = "bg-primary hover:bg-primary/90 text-primary-foreground";
              if (isFlagged) bgClass = "bg-accent hover:bg-accent/90 text-accent-foreground";

              return (
                <button
                  key={q.id}
                  onClick={() => onSelect(index)}
                  className={`relative w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${bgClass} ${
                    isCurrent ? "ring-2 ring-ring ring-offset-2" : ""
                  }`}
                >
                  {index + 1}
                  {isAnswered && !isFlagged && (
                    <Check className="absolute -top-1 -right-1 w-3 h-3 text-primary-foreground bg-success rounded-full p-0.5" />
                  )}
                  {isFlagged && (
                    <Flag className="absolute -top-1 -right-1 w-3 h-3 text-accent-foreground" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Answered:</span>
                <span className="ml-2 font-semibold text-foreground">
                  {Object.keys(answers).length} / {questions.length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Flagged:</span>
                <span className="ml-2 font-semibold text-foreground">{flagged.size}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionNavigator;
