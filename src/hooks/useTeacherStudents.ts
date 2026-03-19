import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export interface TeacherStudent {
  id: number;
  userId: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  role: { id: number; roleName: string };
  email: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
  profileImageUrl: string | null;
  status: string;
  displayProfileImageUrl: string;
}

export const useTeacherStudents = () => {
  const { user, accessToken } = useAuth();
  return useQuery({
    queryKey: ['teacherStudents', user?.id],
    queryFn: async () => {
      const res = await apiFetch<{ code: string; data: TeacherStudent[]; message: string }>(
        `/api/v1/teacher/students?teacherId=${user?.id}`,
        accessToken
      );
      return res.data;
    },
    enabled: !!user?.id && !!accessToken,
  });
};
