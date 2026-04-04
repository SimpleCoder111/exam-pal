import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/lib/api';
import type { TakeExamData } from '@/hooks/useTakeExam';

interface SaveProgressQuestion {
  questionId: number;
  questionText: string;
  questionType: string;
  chapterId: number;
  chapterName: string;
  optionLists: string[];
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


/**
 * Build the save-progress payload from examData and current answers.
 * `answers` maps questionId -> selected option index (0-based).
 */
export const buildSaveProgressPayload = (
  examData: TakeExamData,
  answers: Record<number, number>,
  textAnswers: Record<number, string> = {}
): SaveProgressPayload => {
  const textTypes = ['FILL_IN_THE_BLANK', 'WRITING', 'CODING'];
  const questionLists: SaveProgressQuestion[] = examData.questionLists.map((q) => {
    let studentAnswer: string | null = null;

    if (textTypes.includes(q.questionType)) {
      studentAnswer = textAnswers[q.questionId]?.trim() || null;
    } else {
      const answerIndex = answers[q.questionId];
      studentAnswer =
        answerIndex !== undefined && q.optionLists[answerIndex]
          ? q.optionLists[answerIndex]
          : null;
    }

    return {
      questionId: q.questionId,
      questionText: q.questionText,
      questionType: q.questionType,
      chapterId: q.chapterId,
      chapterName: q.chapterName,
      optionLists: q.optionLists,
      studentAnswer,
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
      console.log('[save-progress] Token present:', !!accessToken);
      console.log('[save-progress] Token preview:', accessToken ? accessToken.substring(0, 30) + '...' : 'NONE');

      const response = await fetch(`${API_BASE_URL}/api/v1/student/exam/save-progress`, {
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
