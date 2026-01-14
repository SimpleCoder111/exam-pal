import { useEffect, useState } from "react";
import { AlertTriangle, X, Shield } from "lucide-react";
import { SecurityViolation } from "@/hooks/useExamSecurity";

interface SecurityWarningProps {
  violation: SecurityViolation | null;
  remainingChances: number;
  maxViolations: number;
}

const SecurityWarning = ({ violation, remainingChances, maxViolations }: SecurityWarningProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentViolation, setCurrentViolation] = useState<SecurityViolation | null>(null);

  useEffect(() => {
    if (violation) {
      setCurrentViolation(violation);
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [violation]);

  if (!isVisible || !currentViolation) return null;

  const isLastChance = remainingChances === 1;
  const isAutoSubmit = remainingChances <= 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-8 pointer-events-none">
      <div
        className={`pointer-events-auto animate-in slide-in-from-top-4 fade-in duration-300 max-w-md w-full mx-4 p-4 rounded-xl shadow-2xl border-2 ${
          isAutoSubmit
            ? "bg-destructive text-destructive-foreground border-destructive"
            : isLastChance
            ? "bg-amber-500 text-white border-amber-600"
            : "bg-destructive/90 text-white border-destructive"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${isAutoSubmit ? "bg-white/20" : "bg-white/10"}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg">
                {isAutoSubmit
                  ? "Exam Auto-Submitted!"
                  : isLastChance
                  ? "Final Warning!"
                  : "Security Violation Detected"}
              </h4>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm mt-1 opacity-90">{currentViolation.message}</p>
            
            {!isAutoSubmit && (
              <div className="mt-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {remainingChances} chance{remainingChances !== 1 ? "s" : ""} remaining
                </span>
                <div className="flex gap-1 ml-2">
                  {Array.from({ length: maxViolations + 1 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < maxViolations + 1 - remainingChances
                          ? "bg-white"
                          : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityWarning;
