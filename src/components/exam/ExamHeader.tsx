import { Clock, Grid3X3, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ExamHeaderProps {
  timeLeft: number;
  formatTime: (seconds: number) => string;
  onShowNavigator: () => void;
}

const ExamHeader = ({ timeLeft, formatTime, onShowNavigator }: ExamHeaderProps) => {
  const isLowTime = timeLeft < 60;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-semibold text-foreground">ExamFlow</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isLowTime
                ? "bg-destructive/10 text-destructive animate-pulse-soft"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
          </div>

          {/* Navigator Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={onShowNavigator}
            className="hidden md:flex"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ExamHeader;
