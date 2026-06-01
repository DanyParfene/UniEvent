import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';

export interface ReportFilters {
  start_date?: string;
  end_date?: string;
  name?: string;
  sort_by?: 'date' | 'name';
  sort_direction?: 'asc' | 'desc';
  department?: string;
}

export interface GenerateReportInput {
  partner_ids?: string[];
  event_ids?: string[];
  filter_params?: ReportFilters;
  report_title?: string;
}

export interface GenerateReportResponse {
  queued: boolean;
  report_type: 'normal' | 'partner';
}

export function useGenerateReport() {
  return useMutation({
    mutationFn: (body: GenerateReportInput) =>
      axiosInstance
        .post<{ data: GenerateReportResponse }>('/generate-report', body)
        .then(r => r.data.data),
  });
}
