import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

// --- Exam Results List (simple) ---
export interface ExamResultListItem {
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

export const useTeacherExamResults = (examId: number | null) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['teacherExamResults', examId],
    queryFn: async () => {
      const res = await apiFetch<{ code: string; data: ExamResultListItem[]; message: string }>(
        `/api/v1/teacher/results/exam/${examId}`,
        accessToken
      );
      return res.data;
    },
    enabled: !!examId && !!accessToken,
  });
};

// --- Grading Details (per student) ---
export interface GradingDetail {
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
  score: boolean;
  scoreEdit: boolean;
  correct: boolean;
}

export interface GradingDetailsData {
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
  details: GradingDetail[];
}

export const useTeacherGradingDetails = (examId: number | null, studentId: string | null) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['teacherGradingDetails', examId, studentId],
    queryFn: async () => {
      const res = await apiFetch<{ code: string; data: GradingDetailsData; message: string }>(
        `/api/v1/teacher/result/grading-details?examId=${examId}&studentId=${studentId}`,
        accessToken
      );
      return res.data;
    },
    enabled: !!examId && !!studentId && !!accessToken,
  });
};
