import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import type { EventDto, PaginatedResponse } from './api-types';

export interface EventFilters {
  page?: number;
  name?: string;
  start_date?: string;
  end_date?: string;
  partners?: string[];
  sort_by?: 'date' | 'name';
  sort_direction?: 'asc' | 'desc';
  archived?: boolean;
  department?: string;
}

export const eventKeys = {
  all: () => ['events'] as const,
  lists: () => ['events', 'list'] as const,
  list: (filters: EventFilters) => ['events', 'list', filters] as const,
  detail: (id: string) => ['event', id] as const,
};

async function fetchEvents(filters: EventFilters): Promise<PaginatedResponse<EventDto>> {
  const params: Record<string, unknown> = { ...filters };
  if (filters.archived) params.archived = 1;
  const res = await axiosInstance.get<{ data: EventDto[]; meta: PaginatedResponse<EventDto>['meta'] }>('/events', { params });
  return { data: res.data.data, meta: res.data.meta };
}

async function fetchEvent(id: string): Promise<EventDto> {
  const res = await axiosInstance.get<{ data: EventDto }>(`/event/${id}`);
  return res.data.data;
}

export function useEvents(filters: EventFilters) {
  return useSuspenseQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => fetchEvents(filters),
  });
}

export function useEventsQuery(filters: EventFilters, enabled = true) {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => fetchEvents(filters),
    enabled,
  });
}

export function useEvent(id: string) {
  return useSuspenseQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => fetchEvent(id),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      axiosInstance.post<{ data: EventDto }>('/event', body).then(r => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all() });
    },
  });
}

export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      axiosInstance.put<{ data: EventDto }>(`/event/${id}`, body).then(r => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}
