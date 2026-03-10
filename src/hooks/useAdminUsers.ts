import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = 'http://localhost:7000';

export interface AdminUserRole {
  id: number;
  roleName: string;
}

export interface AdminUserResponse {
  id: number;
  userId: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  role: AdminUserRole;
  email: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
  profileImageUrl: string | null;
  status: string;
  displayProfileImageUrl: string;
  roleName: string;
  username: string;
}

interface ApiResponse<T> {
  code: string;
  data: T;
  message: string;
}

interface CreateUserPayload {
  name: string;
  email: string;
  role: string;
  password: string;
  userId: string;
  dob: string;
  gender: string;
  roleId: number;
  phoneNumber: string;
  address: string;
  status: boolean;
}

interface UpdateUserPayload extends CreateUserPayload {
  targetUserId: string; // used in the URL path
}

// GET all users
export const useAdminUsers = () => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/users`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: ApiResponse<AdminUserResponse[]> = await res.json();
      if (json.code !== '200' && json.code !== '0') throw new Error(json.message);
      return json.data;
    },
    enabled: !!accessToken,
  });
};

// POST create user
export const useCreateUser = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<CreateUserPayload, 'targetUserId'>) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: ApiResponse<AdminUserResponse> = await res.json();
      if (json.code !== '200' && json.code !== '0') throw new Error(json.message);
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

// PUT update user
export const useUpdateUser = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ targetUserId, ...payload }: UpdateUserPayload) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/user/${targetUserId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: ApiResponse<AdminUserResponse> = await res.json();
      if (json.code !== '200' && json.code !== '0') throw new Error(json.message);
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

// PUT toggle user status
export const useToggleUserStatus = () => {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: boolean }) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/user/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: ApiResponse<AdminUserResponse> = await res.json();
      if (json.code !== '200' && json.code !== '0') throw new Error(json.message);
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

// Role ID mapping helper
export const getRoleId = (roleName: string): number => {
  switch (roleName.toUpperCase()) {
    case 'ADMIN': return 1;
    case 'TEACHER': return 2;
    case 'STUDENT': return 3;
    default: return 3;
  }
};
