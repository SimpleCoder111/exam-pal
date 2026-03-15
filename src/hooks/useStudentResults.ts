import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export interface ExamResult {
  id: number;
  studentId: string;
  score: number;
  timeTaken: number;
  gradedAt: string;
  exam: {
    id: number;
    classId: number;
    duration: number;
    examDate: string;
    examPaperId: number;
    examTitle: string;
    subjectId: number;
  };
}

interface ResultsResponse {
  code: string;
  data: ExamResult[];
  message: string;
}

export const useStudentResults = () => {
  const { user, accessToken } = useAuth();

  return useQuery({
    queryKey: ['student-results', user?.id],
    queryFn: async () => {
      const res = await apiFetch<ResultsResponse>(
        `/api/v1/student/results/${user!.id}`,
        accessToken,
      );
      return res.data;
    },
    enabled: !!user?.id && !!accessToken,
  });
};
