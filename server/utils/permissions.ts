export const PERMISSIONS = {
  MANAGE_CONTACTS: ['admin'],
  MANAGE_VENUES: ['admin', 'manager'],
  MANAGE_USERS: ['admin'],
  MANAGE_INCIDENTS: ['admin', 'manager', 'staff'],
  VIEW_INCIDENTS: ['admin', 'manager', 'staff'],
  VIEW_CONTACTS: ['admin', 'manager', 'staff'],
  VIEW_VENUES: ['admin', 'manager', 'staff'],
  MANAGE_OFFENDERS: ['admin', 'staff'],
  MANAGE_WARNINGS: ['admin', 'staff'],
  VIEW_WARNINGS: ['admin', 'staff'],
  MANAGE_BANS: ['admin', 'staff'],
  VIEW_BANS: ['admin', 'staff'],
};

export const hasPermission = (userRole: string, permission: keyof typeof PERMISSIONS) => {
  return PERMISSIONS[permission].includes(userRole);
};