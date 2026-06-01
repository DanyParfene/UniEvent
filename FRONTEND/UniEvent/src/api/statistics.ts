import { useSuspenseQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import type { StatisticsDashboardDto } from './api-types';

export const statisticsKeys = {
  all: () => ['statistics'] as const,
  dashboard: (department?: string) => ['statistics', 'dashboard', department ?? 'all'] as const,
};

async function fetchStatistics(department?: string): Promise<StatisticsDashboardDto> {
  const params = department ? { department } : {};
  const res = await axiosInstance.get<{ data: StatisticsDashboardDto }>('/statistics', { params });
  return res.data.data;
}

export function useStatistics(department?: string) {
  return useSuspenseQuery({
    queryKey: statisticsKeys.dashboard(department),
    queryFn: () => fetchStatistics(department),
  });
}
