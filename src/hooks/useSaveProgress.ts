import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import type { TakeExamData } from '@/hooks/useTakeExam';

interface SaveProgressQuestion {
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

interface SaveProgressPayload {
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
  questionLists: SaveProgressQuestion[];
}

interface SaveProgressResponse {
  code: string;
  data: {
    examSessionId: number;
    status: string;
    lastSaved: string;
    message: string;
    answeredQuestionsCount: number | null;
    totalQuestionsCount: number | null;
  };
  message: string;
}

const API_BASE_URL = 'http://localhost:7000';

/**
 * Build the save-progress payload from examData and current answers.
 * `answers` maps questionId -> selected option index (0-based).
 */
export const buildSaveProgressPayload = (
  examData: TakeExamData,
  answers: Record<number, number>
): SaveProgressPayload => {
  const questionLists: SaveProgressQuestion[] = examData.questionLists.map((q) => {
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

export const useSaveProgress = () => {
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (payload: SaveProgressPayload) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/exams/student/save-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to save progress: ${response.status}`);
      }

      const res: SaveProgressResponse = await response.json();
      if (res.code !== '200' && res.code !== '0') {
        throw new Error(res.message || 'Failed to save progress');
      }
      return res.data;
    },
  });
};
