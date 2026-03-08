import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export interface StudentClassroom {
  classId: number;
  className: string;
  academicYear: string;
  classStart: string;
  classEnd: string;
  classStatus: string | null;
  classToken: string | null;
  subjectId: number;
  teacherId: string;
}

interface ClassroomsResponse {
  code: string;
  data: StudentClassroom[];
  message: string;
}

export const useStudentClassrooms = () => {
  const { user, accessToken } = useAuth();

  return useQuery({
    queryKey: ['student-classrooms', user?.id],
    queryFn: async () => {
      const res = await apiFetch<ClassroomsResponse>(
        `/api/v1/classes/student?studentId=${user!.id}`,
        accessToken,
      );
      return res.data ?? [];
    },
    enabled: !!user?.id && !!accessToken,
  });
};
