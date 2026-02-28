import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  role: string;
  profileImageUrl: string;
}

interface ProfileResponse {
  code: string;
  data: StudentProfile;
  message: string;
}

export const useStudentProfile = () => {
  const { user, accessToken } = useAuth();

  return useQuery({
    queryKey: ['studentProfile', user?.id],
    queryFn: () =>
      apiFetch<ProfileResponse>(
        `/api/v1/dashboard/student/profile?studentId=${user?.id}`,
        accessToken
      ),
    enabled: !!user?.id && !!accessToken,
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000,
  });
};
