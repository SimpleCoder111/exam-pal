import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export interface LeaderboardEntry {
  studentId: string;
  totalScore: number;
  rank: number;
  totalParticipants: number;
}

interface LeaderboardResponse {
  code: string;
  data: LeaderboardEntry;
  message: string;
}

export const useExamLeaderboard = (examId: string | number | null) => {
  const { user, accessToken } = useAuth();
  return useQuery({
    queryKey: ['leaderboard-exam', examId, user?.id],
    queryFn: async () => {
      const res = await apiFetch<LeaderboardResponse>(
        `/api/v1/student/dashboard/leaderboard/exam/${examId}?studentId=${user!.id}`,
        accessToken
      );
      return res.data;
    },
    enabled: !!examId && !!user?.id && !!accessToken,
  });
};

export const useSubjectLeaderboard = (subjectId: string | number | null) => {
  const { user, accessToken } = useAuth();
  return useQuery({
    queryKey: ['leaderboard-subject', subjectId, user?.id],
    queryFn: async () => {
      const res = await apiFetch<LeaderboardResponse>(
        `/api/v1/student/dashboard/leaderboard/subject/${subjectId}?studentId=${user!.id}`,
        accessToken
      );
      return res.data;
    },
    enabled: !!subjectId && !!user?.id && !!accessToken,
  });
};
