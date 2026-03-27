import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/lib/api';

export interface AdminExamResponse {
  examId: number;
  classId: number;
  subjectId: number;
  examPaperId: number;
  examTitle: string;
  examDate: string;
  duration: number;
  examPaperType: 'AUTO' | 'MANUAL';
  easyQuestions: number;
  mediumQuestions: number;
  hardQuestions: number;
  questionIds: number[];
  examPaperStatus: string;
  examStatus: string;
}

export interface CreateAdminExamPayload {
  classId: number;
  subjectId: number;
  examDate: string;
  examTitle: string;
  duration: number;
  examPaperType: 'AUTO' | 'MANUAL';
  isDraft: boolean;
  easyQuestions?: number;
  mediumQuestions?: number;
  hardQuestions?: number;
  questionIds?: number[];
}

interface ApiResponse<T> {
  code: string;
  data: T;
  message: string;
}

const adminFetch = async (endpoint: string, accessToken: string | null, options?: RequestInit) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  if (json.code !== '0' && json.code !== '200') throw new Error(json.message);
  return json;
};

// GET all exams
export const useAdminExams = () => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['admin-exams'],
    queryFn: async () => {
      const json: ApiResponse<AdminExamResponse[]> = await adminFetch('/api/v1/admin/exams', accessToken);
      return json.data;
    },
    enabled: !!accessToken,
  });
};

// GET single exam details
export const useAdminExamDetail = (examId: number | null) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['admin-exam', examId],
    queryFn: async () => {
      const json: ApiResponse<AdminExamResponse> = await adminFetch(`/api/v1/admin/exam/${examId}`, accessToken);
      return json.data;
    },
    enabled: !!accessToken && examId !== null,
  });
};

// POST create exam
export const useCreateAdminExam = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAdminExamPayload) => {
      return adminFetch('/api/v1/admin/exam', accessToken, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
    },
  });
};

// PUT update exam
export const useUpdateAdminExam = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ examId, payload }: { examId: number; payload: CreateAdminExamPayload }) => {
      return adminFetch(`/api/v1/admin/exam/${examId}`, accessToken, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
    },
  });
};

// DELETE exam
export const useDeleteAdminExam = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (examId: number) => {
      return adminFetch(`/api/v1/admin/exam/${examId}`, accessToken, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exams'] });
    },
  });
};
