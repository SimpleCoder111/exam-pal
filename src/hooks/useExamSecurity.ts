import { useState, useEffect, useCallback, useRef } from "react";

export interface SecurityViolation {
  type: "tab_switch" | "minimize" | "dev_tools" | "copy_paste" | "resize";
  timestamp: Date;
  message: string;
}

interface UseExamSecurityOptions {
  enabled: boolean;
  maxViolations: number;
  onViolation?: (violation: SecurityViolation, count: number) => void;
  onMaxViolations?: () => void;
}

export const useExamSecurity = ({
  enabled,
  maxViolations = 3,
  onViolation,
  onMaxViolations,
}: UseExamSecurityOptions) => {
  const [violations, setViolations] = useState<SecurityViolation[]>([]);
  const [isSecure, setIsSecure] = useState(true);
  const violationCountRef = useRef(0);
  const initialWindowSize = useRef({ width: window.innerWidth, height: window.innerHeight });

  const addViolation = useCallback(
    (type: SecurityViolation["type"], message: string) => {
      if (!enabled) return;

      const violation: SecurityViolation = {
        type,
        timestamp: new Date(),
        message,
      };

      violationCountRef.current += 1;
      const count = violationCountRef.current;

      setViolations((prev) => [...prev, violation]);
      setIsSecure(false);

      onViolation?.(violation, count);

      if (count >= maxViolations + 1) {
        onMaxViolations?.();
      }

      // Reset secure state after a short delay
      setTimeout(() => setIsSecure(true), 3000);
    },
    [enabled, maxViolations, onViolation, onMaxViolations]
  );

  // Tab visibility change detection
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation("tab_switch", "You switched to another tab or window");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [enabled, addViolation]);

  // Window blur (minimize/switch) detection
  useEffect(() => {
    if (!enabled) return;

    const handleBlur = () => {
      // Small delay to avoid false positives from clicking UI elements
      setTimeout(() => {
        if (!document.hasFocus()) {
          addViolation("minimize", "Browser window lost focus");
        }
      }, 100);
    };

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [enabled, addViolation]);

  // Copy/Paste prevention
  useEffect(() => {
    if (!enabled) return;

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      addViolation("copy_paste", "Copy action detected and blocked");
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      addViolation("copy_paste", "Paste action detected and blocked");
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      addViolation("copy_paste", "Cut action detected and blocked");
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
    };
  }, [enabled, addViolation]);

  // DevTools detection (various methods)
  useEffect(() => {
    if (!enabled) return;

    // Method 1: Window size change detection (devtools open changes window size)
    const handleResize = () => {
      const widthDiff = Math.abs(window.innerWidth - initialWindowSize.current.width);
      const heightDiff = Math.abs(window.innerHeight - initialWindowSize.current.height);
      
      // Significant resize might indicate devtools
      if (widthDiff > 200 || heightDiff > 200) {
        // Check if it's likely devtools (sudden significant resize)
        const outerWidth = window.outerWidth;
        const innerWidth = window.innerWidth;
        
        if (outerWidth - innerWidth > 200) {
          addViolation("dev_tools", "Developer tools may have been opened");
        }
      }
      
      // Update reference
      initialWindowSize.current = { width: window.innerWidth, height: window.innerHeight };
    };

    // Method 2: F12 and keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        addViolation("dev_tools", "F12 key press detected");
      }
      
      // Ctrl+Shift+I (Chrome DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        addViolation("dev_tools", "DevTools shortcut detected");
      }
      
      // Ctrl+Shift+J (Chrome Console)
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
        addViolation("dev_tools", "Console shortcut detected");
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        addViolation("dev_tools", "View source shortcut detected");
      }
    };

    // Method 3: Right-click prevention
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [enabled, addViolation]);

  const resetViolations = useCallback(() => {
    setViolations([]);
    violationCountRef.current = 0;
    setIsSecure(true);
  }, []);

  return {
    violations,
    violationCount: violationCountRef.current,
    isSecure,
    remainingChances: Math.max(0, maxViolations + 1 - violationCountRef.current),
    resetViolations,
  };
};
