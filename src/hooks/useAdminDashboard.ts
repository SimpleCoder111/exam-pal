import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = 'http://localhost:7000';

export interface DashboardStats {
  totalStudent: number;
  totalTeacher: number;
  activeSubject: number;
  examThisMonth: number;
  studentChange: string;
  teacherChange: string;
  subjectChange: string;
  examChange: string;
}

export interface DashboardActivity {
  id: number;
  userId: string;
  name: string;
  action: string;
  timestamp: string;
}

interface ApiResponse<T> {
  code: string;
  data: T;
  message: string;
}

export const useAdminDashboardStats = () => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/dashboard/stats`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      // Stats endpoint returns DashboardStatisticResponse directly (not wrapped)
      const json: DashboardStats = await res.json();
      return json;
    },
    enabled: !!accessToken,
  });
};

export const useAdminDashboardActivities = (limit = 10) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['admin-dashboard-activities', limit],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/dashboard/activities?limit=${limit}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: ApiResponse<DashboardActivity[]> = await res.json();
      return json.data;
    },
    enabled: !!accessToken,
  });
};
