import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question } from "@/pages/Exam";

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: number;
  isFlagged: boolean;
  onAnswerSelect: (questionId: number, optionIndex: number) => void;
  onFlagToggle: (questionId: number) => void;
}

const QuestionCard = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isFlagged,
  onAnswerSelect,
  onFlagToggle,
}: QuestionCardProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-card p-8 animate-scale-in">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <Button
          variant={isFlagged ? "default" : "ghost"}
          size="sm"
          onClick={() => onFlagToggle(question.id)}
          className={isFlagged ? "bg-accent text-accent-foreground" : ""}
        >
          <Flag className="w-4 h-4 mr-1" />
          {isFlagged ? "Flagged" : "Flag"}
        </Button>
      </div>

      {/* Question Text */}
      <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground mb-8">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;

          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(question.id, index)}
              className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border hover:border-primary/50 hover:bg-secondary/50 text-foreground"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
