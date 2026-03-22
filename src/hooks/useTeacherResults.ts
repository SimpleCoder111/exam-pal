import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export interface QuestionGradeDetail {
  questionId: number;
  questionType: string;
  pointsPossible: number;
  pointsObtained: number;
  studentAnswer: string | null;
  correctAnswer: string;
  correct: boolean;
}

export interface ExamResultItem {
  id: number;
  exam: {
    id: number;
    classId: number;
    subjectId: number;
    examDate: string;
    examTitle: string;
    duration: number;
    examPaperId: number;
  };
  studentId: string;
  score: number;
  status: string;
  timeTaken: number;
  gradedAt: string;
  details: string; // JSON string of QuestionGradeDetail[]
}

export interface ParsedExamResult extends Omit<ExamResultItem, 'details'> {
  questionDetails: QuestionGradeDetail[];
}

export const useTeacherExamResults = (examId: number | null) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['teacherExamResults', examId],
    queryFn: async () => {
      const res = await apiFetch<{ code: string; data: ExamResultItem[]; message: string }>(
        `/api/v1/teacher/results/exam/${examId}`,
        accessToken
      );
      return res.data.map((item): ParsedExamResult => {
        let questionDetails: QuestionGradeDetail[] = [];
        try {
          questionDetails = JSON.parse(item.details);
        } catch {
          questionDetails = [];
        }
        return { ...item, questionDetails };
      });
    },
    enabled: !!examId && !!accessToken,
  });
};
