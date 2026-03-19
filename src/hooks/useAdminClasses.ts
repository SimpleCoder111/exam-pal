import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = 'http://localhost:7000';

export interface AdminClassResponse {
  classId: number;
  className: string;
  classStart: string;
  classEnd: string;
  classStatus: string;
  classYear: string | null;
  teacherId: string;
  teacherName: string | null;
  studentCount: number;
  subjectId: number;
}

interface ApiResponse<T> {
  code: string;
  data: T;
  message: string;
}

interface CreateClassPayload {
  className: string;
  classStart: string;
  classEnd: string;
  subjectId: number;
  classStatus: string;
  teacherId: string;
  academicYear: string;
}

// GET all classes
export const useAdminClasses = () => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['admin-classes'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/classes`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: ApiResponse<AdminClassResponse[]> = await res.json();
      if (json.code !== '0') throw new Error(json.message);
      return json.data;
    },
    enabled: !!accessToken,
  });
};

// POST create class
export const useCreateClass = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateClassPayload) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: ApiResponse<AdminClassResponse> = await res.json();
      if (json.code !== '0') throw new Error(json.message);
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-classes'] }),
  });
};

// DELETE class
export const useDeleteClass = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (classId: number) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/class/${classId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-classes'] }),
  });
};

// PUT update class
export const useUpdateClass = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ classId, ...payload }: CreateClassPayload & { classId: number }) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/class/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      if (json.code !== '0') throw new Error(json.message);
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-classes'] }),
  });
};

// GET class dashboard summary
export const useAdminClassSummary = () => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['admin-class-summary'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/class/summary`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: ApiResponse<any> = await res.json();
      if (json.code !== '0') throw new Error(json.message);
      return json.data;
    },
    enabled: !!accessToken,
  });
};

// GET teacher lists for class assignment
export const useAdminClassTeachers = () => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['admin-class-teachers'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/class/teachers`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: ApiResponse<any[]> = await res.json();
      if (json.code !== '0') throw new Error(json.message);
      return json.data;
    },
    enabled: !!accessToken,
  });
};

// GET student lists for class assignment
export const useAdminClassStudents = () => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['admin-class-students'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/class/students`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: ApiResponse<any[]> = await res.json();
      if (json.code !== '0') throw new Error(json.message);
      return json.data;
    },
    enabled: !!accessToken,
  });
};
