import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

const API_BASE_URL = 'http://localhost:7000';

// Types
export interface ChapterResponse {
  id: number;
  name: string;
  orderIndex: number;
  questionCount: number;
  active: boolean;
}

export interface SubjectResponse {
  id: number;
  name: string;
  code: string;
  description: string;
  chapterResponseList: ChapterResponse[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

interface ApiResponse<T> {
  code: string;
  data: T;
  message: string;
}

// GET all subjects
export const useAdminSubjects = () => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['admin-subjects'],
    queryFn: () => apiFetch<ApiResponse<SubjectResponse[]>>('/api/v1/admin/subjects', accessToken),
    select: (res) => res.data,
  });
};

// GET subject dashboard
export const useSubjectDashboard = () => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['admin-subjects-dashboard'],
    queryFn: () => apiFetch<ApiResponse<any>>('/api/v1/admin/subject/dashboard', accessToken),
    select: (res) => res.data,
  });
};

// CREATE subject
export const useCreateSubject = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; code: string; description: string; isActive: boolean }) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/subject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-subjects'] }),
  });
};

// UPDATE subject
export const useUpdateSubject = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: number; name: string; code: string; description: string; isActive: boolean }) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/subject/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-subjects'] }),
  });
};

// TOGGLE subject status
export const useToggleSubjectStatus = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/subject/${id}/status?isActive=${isActive}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-subjects'] }),
  });
};

// DELETE subject
export const useDeleteSubject = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/subject/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-subjects'] }),
  });
};

// ADD chapters to subject (bulk)
export const useAddChapters = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ subjectId, chapters }: { subjectId: number; chapters: Array<{ name: string; description: string; isActive: boolean; index: number }> }) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/subject/${subjectId}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
        body: JSON.stringify(chapters),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-subjects'] }),
  });
};

// UPDATE chapter
export const useUpdateChapter = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ chapterId, ...body }: { chapterId: number; name: string; description: string; index: number; isActive: boolean }) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/subject/chapters/${chapterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-subjects'] }),
  });
};

// DELETE chapter
export const useDeleteChapter = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (chapterId: number) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/subject/chapters/${chapterId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-subjects'] }),
  });
};

// TOGGLE chapter status
export const useToggleChapterStatus = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ chapterId, isActive }: { chapterId: number; isActive: boolean }) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/subjects/chapters/${chapterId}/status?isActive=${isActive}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-subjects'] }),
  });
};

// REORDER chapters
export const useReorderChapters = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ subjectId, order }: { subjectId: number; order: Array<{ id: number; index: number }> }) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/subjects/${subjectId}/chapters/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
        body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-subjects'] }),
  });
};
