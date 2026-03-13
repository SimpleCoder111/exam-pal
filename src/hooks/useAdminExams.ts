import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = 'http://localhost:7000';

export interface AdminExamResponse {
  examId: number;
  classId: number;
  subjectId: number;
  examPaperId: number;
  examTitle: string;
  examDate: string;
  duration: number;
  examPaperType: 'AUTO' | 'MANUAL';
  easyQuestions: number;
  mediumQuestions: number;
  hardQuestions: number;
  questionIds: number[];
  examPaperStatus: string;
  examStatus: string;
}

interface ApiResponse<T> {
  code: string;
  data: T;
  message: string;
}

// GET all exams
export const useAdminExams = () => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['admin-exams'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/exams`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: ApiResponse<AdminExamResponse[]> = await res.json();
      if (json.code !== '0' && json.code !== '200') throw new Error(json.message);
      return json.data;
    },
    enabled: !!accessToken,
  });
};
