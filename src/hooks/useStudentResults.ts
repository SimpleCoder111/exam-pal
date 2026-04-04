import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

// --- Results List ---
export interface StudentResultItem {
  id: number;
  examId: string;
  examName: string;
  classId: string;
  studentId: string;
  studentName: string;
  score: number;
  grade: string;
  status: string;
  timeTaken: number;
  gradedAt: string;
}

export const useStudentResults = () => {
  const { user, accessToken } = useAuth();
  return useQuery({
    queryKey: ['student-results', user?.id],
    queryFn: async () => {
      const res = await apiFetch<{ code: string; data: StudentResultItem[]; message: string }>(
        `/api/v1/student/results/${user!.id}`,
        accessToken
      );
      return res.data;
    },
    enabled: !!user?.id && !!accessToken,
  });
};

// --- Grading Details ---
export interface StudentGradingDetail {
  questionId: number;
  questionType: string;
  questionContent: string;
  questionDifficulty: string;
  pointsPossible: number;
  pointsObtained: number;
  summaryMessage: string;
  suggestionForImprovement?: string;
  studentAnswer: string | null;
  correctAnswer: string;
  chapterId: number;
  chapterTitle: string;
  score: boolean;
  correct: boolean;
  scoreEdit: boolean;
}

export interface StudentGradingDetailsData {
  id: number;
  examId: string;
  examName: string;
  classId: string;
  studentId: string;
  grade: string;
  score: number;
  status: string;
  timeTaken: number;
  gradedAt: string;
  details: StudentGradingDetail[];
}

export const useStudentGradingDetails = (examId: string | null, studentId: string | null) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['student-grading-details', examId, studentId],
    queryFn: async () => {
      const res = await apiFetch<{ code: string; data: StudentGradingDetailsData; message: string }>(
        `/api/v1/student/result/grading-result?studentId=${studentId}&examId=${examId}`,
        accessToken
      );
      return res.data;
    },
    enabled: !!examId && !!studentId && !!accessToken,
  });
};
