import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export interface TeacherExam {
  id: number;
  examId?: number;
  examTitle: string;
  classId: number;
  subjectId: number;
  duration: number;
  examDate: string;
  examPaperId: number;
  examPaperType: string | null;
  examStatus: string | null;
}

export interface CreateExamPayload {
  classId: number;
  subjectId: number;
  examDate: string;
  examTitle: string;
  duration: number;
  examPaperType: 'AUTO' | 'MANUAL';
  isDraft: boolean;
  // AUTO fields
  easyQuestions?: number;
  mediumQuestions?: number;
  hardQuestions?: number;
  // MANUAL fields
  questionIds?: number[];
}

export interface UpdateExamPayload {
  classId: number;
  subjectId: number;
  examDate: string;
  examTitle: string;
  duration: string;
  examPaperType: string;
}

// Fetch all exams for a teacher
export const useTeacherExams = () => {
  const { user, accessToken } = useAuth();
  return useQuery({
    queryKey: ['teacherExams', user?.id],
    queryFn: async () => {
      const res = await apiFetch<{ code: string; data: TeacherExam[]; message: string }>(
        `/api/v1/teacher/exams/${user?.id}`,
        accessToken
      );
      return res.data;
    },
    enabled: !!user?.id && !!accessToken,
  });
};

// Create exam (auto or manual)
export const useCreateExam = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateExamPayload) => {
      const response = await fetch(`http://localhost:7000/api/v1/teacher/exam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherExams'] });
    },
  });
};

// Update exam
export const useUpdateExam = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ examId, payload }: { examId: number; payload: UpdateExamPayload }) => {
      const response = await fetch(`http://localhost:7000/api/v1/teacher/exam`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherExams'] });
    },
  });
};

// Delete exam
export const useDeleteExam = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (examId: number) => {
      const response = await fetch(`http://localhost:7000/api/v1/teacher/exam/${examId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherExams'] });
    },
  });
};
