import { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE_URL } from '@/lib/api';

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
      await fetch(API_BASE_URL, {
        method: 'GET',
        mode: 'cors',
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
