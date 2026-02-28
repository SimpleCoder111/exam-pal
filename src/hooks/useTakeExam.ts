import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

export interface TakeExamOption {
  optionId: number;
  optionText: string;
}

export interface TakeExamQuestion {
  questionId: number;
  questionText: string;
  questionType: string;
  chapterId: number;
  chapterName: string;
  optionLists: TakeExamOption[];
  studentAnswer: number | null;
}

export interface TakeExamData {
  studentId: string;
  studentName: string;
  subjectId: number;
  subjectName: string;
  classId: number;
  className: string;
  examId: number;
  examTitle: string;
  examDuration: number;
  examSessionId: number;
  questionLists: TakeExamQuestion[];
}

interface TakeExamResponse {
  code: string;
  data: TakeExamData;
  message: string;
}

interface TakeExamPayload {
  studentId: string;
  examId: number;
  isDemo: boolean;
}

const API_BASE_URL = 'http://localhost:7000';

export const useTakeExam = () => {
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (payload: TakeExamPayload): Promise<TakeExamData> => {
      const response = await fetch(`${API_BASE_URL}/api/v1/exams/student/take-exam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to start exam: ${response.status}`);
      }

      const res: TakeExamResponse = await response.json();
      if (res.code !== '200' && res.code !== '0') {
        throw new Error(res.message || 'Failed to start exam');
      }
      return res.data;
    },
  });
};
