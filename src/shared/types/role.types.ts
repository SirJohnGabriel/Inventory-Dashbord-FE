export const ROLE_OPTIONS = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Users', label: 'Users' },
] as const;

export type Role = (typeof ROLE_OPTIONS)[number]['value'];

export const ROLE_MAP: Record<Role, number> = {
  Admin: 0,
  Users: 1,
};
