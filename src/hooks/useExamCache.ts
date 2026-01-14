import { useState, useEffect, useCallback, useRef } from "react";

interface ExamCacheData {
  examId: string;
  answers: Record<number, number>;
  flagged: number[];
  currentQuestion: number;
  timeLeft: number;
  lastSaved: number;
}

interface UseExamCacheOptions {
  examId: string;
  enabled: boolean;
  autoSaveInterval?: number; // in milliseconds
}

export const useExamCache = ({ examId, enabled, autoSaveInterval = 5000 }: UseExamCacheOptions) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const pendingSaveRef = useRef<ExamCacheData | null>(null);

  const getCacheKey = useCallback(() => `exam_cache_${examId}`, [examId]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Try to sync pending data when coming back online
      if (pendingSaveRef.current) {
        syncToServer(pendingSaveRef.current);
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Save to local storage
  const saveToCache = useCallback(
    (data: Omit<ExamCacheData, "examId" | "lastSaved">) => {
      if (!enabled) return;

      const cacheData: ExamCacheData = {
        ...data,
        examId,
        lastSaved: Date.now(),
      };

      try {
        localStorage.setItem(getCacheKey(), JSON.stringify(cacheData));
        setLastSaved(new Date());
        pendingSaveRef.current = cacheData;
      } catch (error) {
        console.error("Failed to save to cache:", error);
      }
    },
    [enabled, examId, getCacheKey]
  );

  // Load from local storage
  const loadFromCache = useCallback((): ExamCacheData | null => {
    if (!enabled) return null;

    try {
      const cached = localStorage.getItem(getCacheKey());
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Failed to load from cache:", error);
    }
    return null;
  }, [enabled, getCacheKey]);

  // Clear cache
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(getCacheKey());
      pendingSaveRef.current = null;
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  }, [getCacheKey]);

  // Simulate server sync (would be real API call in production)
  const syncToServer = useCallback(async (data: ExamCacheData) => {
    if (!navigator.onLine) {
      pendingSaveRef.current = data;
      return false;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // In real implementation:
      // await fetch('/api/exam/save', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });
      
      pendingSaveRef.current = null;
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error("Failed to sync to server:", error);
      pendingSaveRef.current = data;
      setIsSaving(false);
      return false;
    }
  }, []);

  // Auto-save hook
  const useAutoSave = (
    answers: Record<number, number>,
    flagged: Set<number>,
    currentQuestion: number,
    timeLeft: number
  ) => {
    const saveDataRef = useRef({ answers, flagged, currentQuestion, timeLeft });

    useEffect(() => {
      saveDataRef.current = { answers, flagged, currentQuestion, timeLeft };
    }, [answers, flagged, currentQuestion, timeLeft]);

    useEffect(() => {
      if (!enabled) return;

      const interval = setInterval(() => {
        const data = saveDataRef.current;
        saveToCache({
          answers: data.answers,
          flagged: Array.from(data.flagged),
          currentQuestion: data.currentQuestion,
          timeLeft: data.timeLeft,
        });
      }, autoSaveInterval);

      return () => clearInterval(interval);
    }, []);
  };

  return {
    saveToCache,
    loadFromCache,
    clearCache,
    syncToServer,
    useAutoSave,
    isSaving,
    lastSaved,
    isOffline,
    hasPendingSync: !!pendingSaveRef.current,
  };
};
