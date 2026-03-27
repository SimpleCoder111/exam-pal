import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch, API_BASE_URL } from '@/lib/api';

export interface TeacherClass {
  classId: number;
  className: string;
  subjectId: number;
  teacherId: string;
  classStart: string;
  classEnd: string;
  classStatus: string;
  academicYear: string | null;
  classToken: string;
}

export interface QRData {
  joinUrl: string;
  qrBase64: string;
  token: string;
}

export interface PendingRequest {
  classEnrolledId: number;
  studentName: string;
  studentEmail: string;
  requestAt: string;
  status: string;
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

// Fetch teacher's classes
export const useTeacherClasses = () => {
  const { user, accessToken } = useAuth();
  return useQuery({
    queryKey: ['teacherClasses', user?.id],
    queryFn: async () => {
      const res = await apiFetch<{ code: string; data: TeacherClass[]; message: string }>(
        `/api/v1/teacher/classes/${user?.id}`,
        accessToken
      );
      return res.data;
    },
    enabled: !!user?.id && !!accessToken,
  });
};

// Generate QR code for a class
export const useClassQR = (classId: number | null) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['classQR', classId],
    queryFn: async () => {
      const res = await apiFetch<{ code: string; data: QRData; message: string }>(
        `/api/v1/teacher/class/${classId}/generate-qr`,
        accessToken
      );
      return res.data;
    },
    enabled: !!classId && !!accessToken,
  });
};

// Fetch pending enrollment requests
export const usePendingRequests = (classId: number | null) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['pendingRequests', classId],
    queryFn: async () => {
      const res = await apiFetch<{ code: string; data: PendingRequest[]; message: string }>(
        `/api/v1/teacher/class/enrollment/pending?classId=${classId}`,
        accessToken
      );
      return res.data;
    },
    enabled: !!classId && !!accessToken,
  });
};

// Fetch enrolled students for a class
export const useClassEnrollments = (classId: number | null) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['classEnrollments', classId],
    queryFn: async () => {
      const res = await apiFetch<{ code: string; data: EnrolledStudent[]; message: string }>(
        `/api/v1/teacher/class/${classId}/enrollments`,
        accessToken
      );
      return res.data;
    },
    enabled: !!classId && !!accessToken,
  });
};

// Approve or reject enrollment
export const useUpdateEnrollment = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ classEnrolledId, isApproved }: { classEnrolledId: number; isApproved: boolean }) => {
      const response = await fetch(`${API_BASE_URL}/api/v1/teacher/class/enrollment/update_status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ classEnrolledId, isApproved }),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['teacherClasses'] });
      queryClient.invalidateQueries({ queryKey: ['classEnrollments'] });
    },
  });
};
