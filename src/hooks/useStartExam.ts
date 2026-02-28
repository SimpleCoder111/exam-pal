import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface ExamOption {
  optionId: number;
  optionText: string;
}

export interface ExamQuestion {
  questionId: number;
  questionText: string;
  questionType: string;
  chapterId: number;
  chapterName: string;
  optionLists: ExamOption[];
  studentAnswer: number | null;
}

export interface ExamSessionData {
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
  questionLists: ExamQuestion[];
}

interface StartExamRequest {
  studentId: string;
  examId: number;
  isDemo?: boolean;
}

interface StartExamResponse {
  code: string;
  data: ExamSessionData;
  message: string;
}

const API_BASE_URL = 'http://localhost:7000';

export const useStartExam = () => {
  const { accessToken } = useAuth();
  const [data, setData] = useState<ExamSessionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startExam = async (request: StartExamRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/exams/student/take-exam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to start exam: ${response.status}`);
      }

      const res: StartExamResponse = await response.json();

      if (res.code !== '200' && res.code !== '0') {
        throw new Error(res.message || 'Failed to start exam');
      }

      setData(res.data);
      return res.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { startExam, data, loading, error };
};
