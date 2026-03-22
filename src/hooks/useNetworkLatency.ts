import { useState, useEffect, useRef, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:7000';

interface UseNetworkLatencyOptions {
  enabled: boolean;
  interval?: number; // ms between pings
}

export const useNetworkLatency = ({ enabled, interval = 15000 }: UseNetworkLatencyOptions) => {
  const [latency, setLatency] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const measure = useCallback(async () => {
    if (!navigator.onLine) {
      setLatency(null);
      return;
    }

    try {
      const start = performance.now();
      await fetch(`${API_BASE_URL}/api/v1/student/exam/save-progress`, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
      });
      const end = performance.now();
      setLatency(Math.round(end - start));
    } catch {
      setLatency(null);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    measure();
    intervalRef.current = setInterval(measure, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, interval, measure]);

  return latency;
};
