import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

export interface ChapterResponse {
  id: number;
  name: string;
  orderIndex: number;
  questionCount: number;
  active: boolean;
}

export interface TeacherSubject {
  id: number;
  name: string;
  code: string;
  description: string;
  chapterResponseList: ChapterResponse[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

interface SubjectsApiResponse {
  code: string;
  data: TeacherSubject[];
  message: string;
}

export const useTeacherSubjects = () => {
  const { user, accessToken } = useAuth();

  return useQuery({
    queryKey: ['teacherSubjects', user?.id],
    queryFn: () =>
      apiFetch<SubjectsApiResponse>(
        `/api/v1/subjects/${user?.id}`,
        accessToken
      ),
    enabled: !!user?.id && !!accessToken,
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  });
};
