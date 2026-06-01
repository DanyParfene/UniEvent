import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import type { PartnerDto } from './api-types';

export const partnerKeys = {
  all: () => ['partners'] as const,
  list: (department?: string) => ['partners', 'list', department ?? 'all'] as const,
};

async function fetchPartners(department?: string): Promise<PartnerDto[]> {
  const params: Record<string, string> = {};
  if (department && department !== 'UVT') params.department = department;
  const res = await axiosInstance.get<{ data: PartnerDto[] }>('/partners', { params });
  return res.data.data;
}

export function usePartners(department?: string) {
  return useSuspenseQuery({
    queryKey: partnerKeys.list(department),
    queryFn: () => fetchPartners(department),
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; logo_path?: string; department?: string | null }) =>
      axiosInstance.post<{ data: PartnerDto }>('/partners', body).then(r => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.all() });
    },
  });
}

export function useUpdatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; name: string; logo_path?: string }) =>
      axiosInstance.put<{ data: PartnerDto }>(`/partners/${id}`, body).then(r => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.all() });
    },
  });
}

export function useDeletePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/partners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.all() });
    },
  });
}
