import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import type { TakeExamData } from '@/hooks/useTakeExam';
import { API_BASE_URL } from '@/lib/api';

interface SubmitExamQuestion {
  questionId: number;
  questionText: string;
  questionType: string;
  chapterId: number;
  chapterName: string;
  optionLists: string[];
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
  ipAddress: string;
  latency: string;
}

export interface QuestionGradeDetail {
  questionId: number;
  questionType: string;
  pointsPossible: number;
  pointsObtained: number;
  studentAnswer: string | null;
  correctAnswer: string;
  correct: boolean;
  suggestionForImprovement?: string;
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
  questionGradeDetails: QuestionGradeDetail[];
}

interface SubmitExamResponse {
  code: string;
  data: SubmitExamResult;
  message: string;
}



export const buildSubmitPayload = (
  examData: TakeExamData,
  answers: Record<number, number>,
  textAnswers: Record<number, string> = {},
  ipAddress: string = '',
  latency: string = ''
): SubmitExamPayload => {
  const textTypes = ['FILL_IN_THE_BLANK', 'WRITING', 'CODING'];
  const questionLists: SubmitExamQuestion[] = examData.questionLists.map((q) => {
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
    ipAddress,
    latency,
  };
};

export const useSubmitExam = () => {
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (payload: SubmitExamPayload): Promise<SubmitExamResult> => {
      const response = await fetch(`${API_BASE_URL}/api/v1/student/exam/submit`, {
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
