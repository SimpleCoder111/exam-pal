import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch, API_BASE_URL } from '@/lib/api';

// --- Types matching new API ---

export interface ApiQuestion {
  id: number;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_THE_BLANK' | 'CODING' | 'WRITING';
  questionContent: string;
  optionContent: string[];
  correctAnswer: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  createdBy: string;
  points: string;
  createdAt: string;
}

interface QuestionsApiResponse {
  code: string;
  data: ApiQuestion[];
  message: string;
}

export interface QuestionSummary {
  totalQuestions: number;
  totalEasyQuestions: number;
  totalMediumQuestions: number;
  totalHardQuestions: number;
  totalQcmQuestions: number;
  totalFillBlankQuestions: number;
  totalTrueFalseQuestions: number;
  totalCodingQuestions: number;
  totalWritingQuestions: number;
}

interface SummaryApiResponse {
  code: string;
  data: QuestionSummary;
  message: string;
}

interface ImportApiResponse {
  code: string;
  data: {
    importedCount: number;
    failedCount: number;
    errors: string[];
  };
  message: string;
}

interface MutationResponse {
  code: string;
  data: unknown;
  message: string;
}

// --- Payload Types ---

export interface CreateQuestionPayload {
  subjectId: number;
  chapterId: number;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_THE_BLANK' | 'CODING' | 'WRITING';
  questionContent: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  createdBy: string;
  score: number;
  correctAnswer: string;
  optionLists: string[];
}

export type UpdateQuestionPayload = CreateQuestionPayload;

// --- Hooks ---

/** GET /api/v1/admin/questions/{subjectId} */
export const useAdminQuestions = (subjectId: number | null) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['adminQuestions', subjectId],
    queryFn: () =>
      apiFetch<QuestionsApiResponse>(
        `/api/v1/admin/questions/${subjectId}`,
        accessToken
      ),
    enabled: !!subjectId && !!accessToken,
    select: (res) => res.data,
    staleTime: 2 * 60 * 1000,
  });
};

/** GET /api/v1/admin/question/summary */
export const useAdminQuestionSummary = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['adminQuestionSummary'],
    queryFn: () =>
      apiFetch<SummaryApiResponse>(
        `/api/v1/admin/question/summary`,
        accessToken
      ),
    enabled: !!accessToken,
    select: (res) => res.data,
    staleTime: 2 * 60 * 1000,
  });
};

/** POST /api/v1/admin/question/{subjectId} — sends array of payloads */
export const useCreateAdminQuestion = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subjectId, payloads }: { subjectId: number; payloads: CreateQuestionPayload[] }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/question/${subjectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payloads),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return response.json() as Promise<MutationResponse>;
    },
    onSuccess: (_, { subjectId }) => {
      queryClient.invalidateQueries({ queryKey: ['adminQuestions', subjectId] });
      queryClient.invalidateQueries({ queryKey: ['adminQuestionSummary'] });
    },
  });
};

/** PUT /api/v1/question/{questionId} */
export const useUpdateAdminQuestion = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId, payload }: { questionId: number; payload: UpdateQuestionPayload }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/question/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return response.json() as Promise<MutationResponse>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminQuestions'] });
      queryClient.invalidateQueries({ queryKey: ['adminQuestionSummary'] });
    },
  });
};

/** DELETE /api/v1/admin/question/{questionId} */
export const useDeleteAdminQuestion = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: number) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/question/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return response.json() as Promise<MutationResponse>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminQuestions'] });
      queryClient.invalidateQueries({ queryKey: ['adminQuestionSummary'] });
    },
  });
};

/** POST /api/v1/admin/questions/import?subjectId={id} */
export const useImportAdminQuestions = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subjectId, file }: { subjectId: number; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/questions/import?subjectId=${subjectId}`,
        {
          method: 'POST',
          headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: formData,
        }
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return response.json() as Promise<ImportApiResponse>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminQuestions'] });
      queryClient.invalidateQueries({ queryKey: ['adminQuestionSummary'] });
    },
  });
};
