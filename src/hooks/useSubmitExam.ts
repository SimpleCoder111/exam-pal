import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import type { TakeExamData } from '@/hooks/useTakeExam';

interface SubmitExamQuestion {
  questionId: number;
  questionText: string;
  questionType: string;
  chapterId: number;
  chapterName: string;
  optionLists: {
    optionId: number;
    optionText: string;
  }[];
  studentAnswer: string | null;
}

interface SubmitExamPayload {
  subjectId: number;
  subjectName: string;
  classId: number;
  studentId: string;
  studentName: string;
  className: string;
  examId: number;
  examTitle: string;
  examDuration: number;
  examSessionId: number;
  questionLists: SubmitExamQuestion[];
}

export interface SubmitExamResult {
  examSessionId: number;
  status: string;
  submittedAt: string;
  obtainedScore: number;
  totalPossibleScore: number;
  answeredCount: number;
  totalQuestions: number;
  message: string;
  isLate: boolean;
}

interface SubmitExamResponse {
  code: string;
  data: SubmitExamResult;
  message: string;
}

const API_BASE_URL = 'http://localhost:7000';

export const buildSubmitPayload = (
  examData: TakeExamData,
  answers: Record<number, number>
): SubmitExamPayload => {
  const questionLists: SubmitExamQuestion[] = examData.questionLists.map((q) => {
    const answerIndex = answers[q.questionId];
    const selectedOptionId =
      answerIndex !== undefined && q.optionLists[answerIndex]
        ? String(q.optionLists[answerIndex].optionId)
        : null;

    return {
      questionId: q.questionId,
      questionText: q.questionText,
      questionType: q.questionType,
      chapterId: q.chapterId,
      chapterName: q.chapterName,
      optionLists: q.optionLists.map((o) => ({
        optionId: o.optionId,
        optionText: o.optionText,
      })),
      studentAnswer: selectedOptionId,
    };
  });

  return {
    subjectId: examData.subjectId,
    subjectName: examData.subjectName,
    classId: examData.classId,
    studentId: examData.studentId,
    studentName: examData.studentName,
    className: examData.className,
    examId: examData.examId,
    examTitle: examData.examTitle,
    examDuration: examData.examDuration,
    examSessionId: examData.examSessionId,
    questionLists,
  };
};

export const useSubmitExam = () => {
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (payload: SubmitExamPayload): Promise<SubmitExamResult> => {
      const response = await fetch(`${API_BASE_URL}/api/v1/exams/student/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit exam: ${response.status}`);
      }

      const res: SubmitExamResponse = await response.json();
      if (res.code !== '200' && res.code !== '0') {
        throw new Error(res.message || 'Failed to submit exam');
      }
      return res.data;
    },
  });
};
