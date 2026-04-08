let cachedIp: string | null = null;

export const getClientIpAddress = async (): Promise<string> => {
  if (cachedIp) return cachedIp;
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    cachedIp = data.ip || '';
    return cachedIp;
  } catch {
    return '';
  }
};

export const getLatencyString = (latencyMs: number | null): string => {
  if (latencyMs === null) return 'unknown';
  return `${latencyMs}ms`;
};
