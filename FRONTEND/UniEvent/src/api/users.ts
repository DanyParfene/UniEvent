import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import type { UserAdminDto, UserRole } from './api-types';

export const userKeys = {
  all: () => ['users'] as const,
  list: () => ['users', 'list'] as const,
};

async function fetchUsers(): Promise<UserAdminDto[]> {
  const res = await axiosInstance.get<{ data: { users: UserAdminDto[] } }>('/users');
  return res.data.data.users;
}

export function useUsers() {
  return useSuspenseQuery({
    queryKey: userKeys.list(),
    queryFn: fetchUsers,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role_name }: { id: string; role_name: UserRole }) =>
      axiosInstance.put(`/users/${id}/role`, { role_name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all() });
    },
  });
}
