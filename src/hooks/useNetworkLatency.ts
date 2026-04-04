import { useState, useEffect, useRef, useCallback } from 'react';

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

    const connection = (navigator as Navigator & {
      connection?: { rtt?: number };
    }).connection;

    const measuredLatency = connection?.rtt;
    setLatency(typeof measuredLatency === 'number' && measuredLatency > 0 ? measuredLatency : null);
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
