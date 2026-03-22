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

export interface EnrolledStudent {
  id: number;
  userId: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
  profileImageUrl: string | null;
  displayProfileImageUrl: string;
  status: string;
}

export interface PendingEnrollment {
  classEnrolledId: number;
  studentName: string;
  studentEmail: string;
  requestAt: string;
  status: string;
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

// GET enrolled students for a class
export const useAdminClassEnrollments = (classId: number | null) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['admin-class-enrollments', classId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/class/${classId}/enrollments`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: ApiResponse<EnrolledStudent[]> = await res.json();
      if (json.code !== '200' && json.code !== '0') throw new Error(json.message);
      return json.data;
    },
    enabled: !!classId && !!accessToken,
  });
};

// GET pending enrollment requests for a class
export const useAdminPendingEnrollments = (classId: number | null) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['admin-pending-enrollments', classId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/class/enrollment/pending?classId=${classId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: ApiResponse<PendingEnrollment[]> = await res.json();
      if (json.code !== '200' && json.code !== '0') throw new Error(json.message);
      return json.data;
    },
    enabled: !!classId && !!accessToken,
  });
};

// PUT update enrollment status (approve/reject)
export const useAdminUpdateEnrollment = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ classEnrolledId, isApproved }: { classEnrolledId: number; isApproved: boolean }) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/class/enrollment/update_status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ classEnrolledId, isApproved }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-pending-enrollments'] });
      qc.invalidateQueries({ queryKey: ['admin-class-enrollments'] });
      qc.invalidateQueries({ queryKey: ['admin-classes'] });
    },
  });
};

// POST enroll student to class
export const useAdminEnrollStudent = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ studentId, classId }: { studentId: string; classId: number }) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/class/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ studentId, classId }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-class-enrollments'] });
      qc.invalidateQueries({ queryKey: ['admin-classes'] });
    },
  });
};
