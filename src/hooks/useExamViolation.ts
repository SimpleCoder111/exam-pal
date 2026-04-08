import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/lib/api';

export interface ExamViolationPayload {
  studentId: string;
  examId: number;
  violationType: string;
  violationCount: number;
  examSessionId: number;
}

export const useExamViolation = () => {
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (payload: ExamViolationPayload) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/student/exam/violation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to report violation: ${response.status}`);
      }

      return response.json();
    },
  });
};
