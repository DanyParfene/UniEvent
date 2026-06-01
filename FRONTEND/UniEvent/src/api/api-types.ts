export type Department =
  | 'ARTE' | 'CBG' | 'DREPT' | 'FEAA' | 'FEFS'
  | 'FFM' | 'INFO' | 'FLIFT' | 'FMT' | 'FPSE'
  | 'FSAS' | 'FSGC';

export type EventStatus = 'draft' | 'published' | 'archived';
export type OrganizationMode = 'physical' | 'hybrid' | 'online';
export type Livestream = 'YES' | 'NO';
export type UserRole = 'coordinator' | 'department_administrator' | 'super_administrator';
export type MetricCategory =
  | 'album_foto' | 'facebook' | 'instagram' | 'tiktok'
  | 'comunicat_presa' | 'aparitii_presa' | 'statistici' | 'podcast';

export interface PartnerDto {
  id: string;
  name: string;
  logo_path: string | null;
  department: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventMetricDto {
  id: string;
  event_id: string;
  category: MetricCategory;
  link: string;
  reach: number;
  engagement: number;
}

export interface EventDto {
  id: string;
  department: string;
  eventName: string;
  banner: string | null;
  startEventDate: string;
  finishEventDate: string;
  edition: number;
  organizer: string;
  description: string;
  location: string;
  invitations: string[];
  organizationMode: OrganizationMode;
  numberOfParticipants: number;
  targetGroup: string;
  livestream: Livestream;
  coordinator: string;
  email: string;
  telephone: string;
  otherInformation: string | null;
  status: EventStatus;
  partners: PartnerDto[];
  metrics: EventMetricDto[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatorMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatorMeta;
}

export interface StatisticsDashboardDto {
  best_partner: PartnerDto | null;
  last_month_press_aparitions: number;
  next_5_events: Array<{ id: string; name: string }> | string;
  best_organizator: string | null;
  most_participants: number;
  number_of_events_per_month: Array<{ month: string; count: number }>;
}

export interface UserAdminDto {
  id: string;
  name: string;
  email: string;
  current_role: UserRole;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  coordinator: 'Coordonator',
  department_administrator: 'Administrator de Departament',
  super_administrator: 'Super Administrator',
};

export const ROLE_VALUES: UserRole[] = [
  'coordinator',
  'department_administrator',
  'super_administrator',
];
