import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Question } from "@/pages/Exam";

interface StrengthMapProps {
  questions: Question[];
  answers: Record<number, number>;
}

interface ChapterStats {
  name: string;
  chapterId: number;
  correct: number;
  total: number;
  percentage: number;
}

const StrengthMap = ({ questions, answers }: StrengthMapProps) => {
  // Group questions by chapter and calculate performance
  const chapterStats = questions.reduce((acc, question) => {
    const existing = acc.find(ch => ch.chapterId === question.chapterId);
    const isCorrect = answers[question.id] === question.correctAnswer;

    if (existing) {
      existing.total += 1;
      if (isCorrect) existing.correct += 1;
    } else {
      acc.push({
        name: question.chapter,
        chapterId: question.chapterId,
        correct: isCorrect ? 1 : 0,
        total: 1,
        percentage: 0,
      });
    }
    return acc;
  }, [] as ChapterStats[]);

  // Calculate percentages
  chapterStats.forEach(ch => {
    ch.percentage = Math.round((ch.correct / ch.total) * 100);
  });

  // Sort by percentage (high to low)
  chapterStats.sort((a, b) => b.percentage - a.percentage);

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500/10 text-green-700 border-green-500/20";
    if (percentage >= 60) return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    return "bg-red-500/10 text-red-700 border-red-500/20";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTrendIcon = (percentage: number) => {
    if (percentage >= 80) {
      return <TrendingUp className="w-5 h-5 text-green-600" />;
    }
    if (percentage >= 60) {
      return <Minus className="w-5 h-5 text-yellow-600" />;
    }
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="bg-card rounded-2xl shadow-elevated p-8 mb-12 animate-scale-in">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
          Topic Strength Map
        </h2>
        <p className="text-muted-foreground">
          Performance breakdown by chapter
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {chapterStats.map((chapter) => (
          <div
            key={chapter.chapterId}
            className={`rounded-xl p-6 border-2 transition-all hover:shadow-md ${getPerformanceColor(
              chapter.percentage
            )}`}
          >
            {/* Header with title and icon */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-sm truncate pr-2">
                  {chapter.name}
                </h3>
                <p className="text-xs opacity-75 mt-1">
                  {chapter.correct} of {chapter.total}
                </p>
              </div>
              {getTrendIcon(chapter.percentage)}
            </div>

            {/* Percentage Display */}
            <div className="text-center mb-4">
              <div className="font-heading text-3xl font-bold">
                {chapter.percentage}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress
                value={chapter.percentage}
                className="h-2"
              />
              <div className="flex justify-between text-xs">
                <span>Correct</span>
                <span className="opacity-75">
                  {chapter.percentage >= 80
                    ? "Strong"
                    : chapter.percentage >= 60
                    ? "Good"
                    : "Needs Work"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-8 pt-8 border-t border-border">
        <h3 className="font-semibold text-foreground mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <div className="font-heading text-2xl font-bold text-foreground">
              {chapterStats.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Topics Covered
            </div>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4 text-center">
            <div className="font-heading text-2xl font-bold text-green-600">
              {chapterStats.filter(c => c.percentage >= 80).length}
            </div>
            <div className="text-xs text-green-700 mt-1">Strong Topics</div>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-4 text-center">
            <div className="font-heading text-2xl font-bold text-yellow-600">
              {chapterStats.filter(c => c.percentage >= 60 && c.percentage < 80).length}
            </div>
            <div className="text-xs text-yellow-700 mt-1">Good Topics</div>
          </div>
          <div className="bg-red-500/10 rounded-lg p-4 text-center">
            <div className="font-heading text-2xl font-bold text-red-600">
              {chapterStats.filter(c => c.percentage < 60).length}
            </div>
            <div className="text-xs text-red-700 mt-1">Areas to Improve</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrengthMap;
