import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export interface StudentExam {
  examId: number;
  classId: number;
  subjectId: number;
  examPaperId: number;
  examTitle: string;
  examDate: string;
  duration: number;
  examPaperType: string;
  easyQuestions: number;
  mediumQuestions: number;
  hardQuestions: number;
  questionIds: number[];
  examPaperStatus: string;
  examStatus: string;
}

interface ExamsResponse {
  code: string;
  data: StudentExam[];
  message: string;
}

export const useStudentExams = () => {
  const { user, accessToken } = useAuth();

  return useQuery({
    queryKey: ['student-exams', user?.id],
    queryFn: async () => {
      const res = await apiFetch<ExamsResponse>(
        `/api/v1/exams/student/${user!.id}`,
        accessToken
      );
      return res.data ?? [];
    },
    enabled: !!user?.id && !!accessToken,
  });
};
