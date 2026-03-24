import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

const API_BASE_URL = 'http://localhost:7000';

// --- API Types ---

export interface ApiOption {
  optionId?: number;
  optionText: string;
  isCorrect: boolean;
}

export interface ApiQuestion {
  questionId: number;
  chapterId: number;
  chapter: string;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'CODING' | 'WRITING';
  questionContent: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  createdBy: string;
  optionLists: ApiOption[];
}

interface QuestionsApiResponse {
  code: string;
  data: {
    questionData: ApiQuestion[];
    subjectId: number;
    subjectName: string;
  };
  message: string;
}

export interface QuestionSummary {
  totalQuestions: number;
  totalEasyQuestions: number;
  totalMediumQuestions: number;
  totalHardQuestions: number;
  totalMCQQuestions: number;
  totalFillBlankQuestions: number;
  totalTrueFalseQuestions: number;
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
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'CODING' | 'WRITING';
  questionContent: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  createdBy: string;
  optionLists: { optionText: string; isCorrect: boolean }[];
}

export interface UpdateQuestionPayload extends CreateQuestionPayload {
  optionLists: { optionId?: number; optionText: string; isCorrect: boolean }[];
}

// --- Hooks ---

export const useTeacherQuestions = (subjectId: number | null) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['teacherQuestions', subjectId],
    queryFn: () =>
      apiFetch<QuestionsApiResponse>(
        `/api/v1/teacher/questions/${subjectId}`,
        accessToken
      ),
    enabled: !!subjectId && !!accessToken,
    select: (res) => res.data,
    staleTime: 2 * 60 * 1000,
  });
};

export const useQuestionSummary = () => {
  const { user, accessToken } = useAuth();

  return useQuery({
    queryKey: ['questionSummary', user?.id],
    queryFn: () =>
      apiFetch<SummaryApiResponse>(
        `/api/v1/teacher/question/summary/${user?.id}`,
        accessToken
      ),
    enabled: !!user?.id && !!accessToken,
    select: (res) => res.data,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateQuestion = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subjectId, payload }: { subjectId: number; payload: CreateQuestionPayload }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/teacher/question/${subjectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return response.json() as Promise<MutationResponse>;
    },
    onSuccess: (_, { subjectId }) => {
      queryClient.invalidateQueries({ queryKey: ['teacherQuestions', subjectId] });
      queryClient.invalidateQueries({ queryKey: ['questionSummary'] });
    },
  });
};

export const useUpdateQuestion = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId, payload }: { questionId: number; payload: UpdateQuestionPayload }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/teacher/question/${questionId}`, {
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
      queryClient.invalidateQueries({ queryKey: ['teacherQuestions'] });
      queryClient.invalidateQueries({ queryKey: ['questionSummary'] });
    },
  });
};

export const useDeleteQuestion = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: number) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/teacher/question/${questionId}`, {
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
      queryClient.invalidateQueries({ queryKey: ['teacherQuestions'] });
      queryClient.invalidateQueries({ queryKey: ['questionSummary'] });
    },
  });
};

export const useImportQuestions = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subjectId, file }: { subjectId: number; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/teacher/questions/import?subjectId=${subjectId}`,
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
      queryClient.invalidateQueries({ queryKey: ['teacherQuestions'] });
      queryClient.invalidateQueries({ queryKey: ['questionSummary'] });
    },
  });
};
