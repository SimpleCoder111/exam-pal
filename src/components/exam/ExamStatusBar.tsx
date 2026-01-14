import { Shield, Wifi, WifiOff, Save, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExamStatusBarProps {
  remainingChances: number;
  maxViolations: number;
  isOffline: boolean;
  lastSaved: Date | null;
  isSaving: boolean;
}

const ExamStatusBar = ({
  remainingChances,
  maxViolations,
  isOffline,
  lastSaved,
  isSaving,
}: ExamStatusBarProps) => {
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 5) return "Just now";
    if (diffSecs < 60) return `${diffSecs}s ago`;
    const diffMins = Math.floor(diffSecs / 60);
    return `${diffMins}m ago`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border py-2 px-4">
      <div className="container mx-auto flex items-center justify-between gap-4 text-sm">
        {/* Security Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Chances:</span>
            <div className="flex gap-1">
              {Array.from({ length: maxViolations + 1 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < maxViolations + 1 - remainingChances
                      ? "bg-destructive"
                      : "bg-green-500"
                  }`}
                />
              ))}
            </div>
            <span className="font-medium text-foreground">{remainingChances} left</span>
          </div>
        </div>

        {/* Connection & Save Status */}
        <div className="flex items-center gap-4">
          {/* Network Status */}
          <Badge variant={isOffline ? "destructive" : "secondary"} className="gap-1">
            {isOffline ? (
              <>
                <WifiOff className="w-3 h-3" />
                Offline
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3" />
                Online
              </>
            )}
          </Badge>

          {/* Save Status */}
          <div className="flex items-center gap-2 text-muted-foreground">
            {isSaving ? (
              <>
                <Save className="w-4 h-4 animate-pulse" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Saved {formatLastSaved(lastSaved)}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Auto-save enabled</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamStatusBar;
