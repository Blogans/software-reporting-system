export const PERMISSIONS = {
  MANAGE_CONTACTS: ['admin'],
  MANAGE_VENUES: ['admin', 'manager'],
  MANAGE_USERS: ['admin'],
  VIEW_CONTACTS: ['admin', 'manager', 'staff'],
  VIEW_VENUES: ['admin', 'manager', 'staff'],
  MANAGE_OFFENDERS: ['admin', 'staff'],
};

export const hasPermission = (userRole: string, permission: keyof typeof PERMISSIONS) => {
  return PERMISSIONS[permission].includes(userRole);
};