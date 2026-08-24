import { UserRole } from '../types';

export const ROLES: Record<string, UserRole> = {
  ADMIN: 'admin',
  USER: 'user',
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'users:create',
    'users:edit',
    'users:deactivate',
    'notices:create',
    'notices:edit',
    'notices:delete',
    'events:create',
    'events:edit',
    'events:delete',
    'admin:panel',
  ],
  [ROLES.USER]: [
    'notices:view',
    'events:view',
    'events:attend',
    'local:presence',
  ],
};

export const hasPermission = (role: UserRole, permission: string): boolean => {
  const userPermissions = PERMISSIONS[role];
  return userPermissions?.includes(permission) ?? false;
};
