import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export interface EnrolledSubject {
  subjectId: string;
  subjectName: string;
  teacherName: string;
  nextExamDate: string | null;
}

interface SubjectsResponse {
  code: string;
  data: EnrolledSubject[];
  message: string;
}

export const useStudentSubjects = () => {
  const { user, accessToken } = useAuth();

  return useQuery({
    queryKey: ['studentSubjects', user?.id],
    queryFn: () =>
      apiFetch<SubjectsResponse>(
        `/api/v1/dashboard/student/enrolled-subjects?studentId=${user?.id}`,
        accessToken
      ),
    enabled: !!user?.id && !!accessToken,
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  });
};
