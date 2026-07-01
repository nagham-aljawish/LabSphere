import type { UserRole } from "../services/types";

export const roleDashboardPaths: Record<UserRole, string> = {
  admin: "/admin",
  doctor: "/doctor",
  technician: "/technician",
  reception: "/receptionist",
  patient: "/home",
};

export function getDashboardPath(role: UserRole): string {
  return roleDashboardPaths[role];
}

export function userHasRole(
  user: { role: UserRole; roles?: UserRole[] },
  allowedRoles: UserRole[],
): boolean {
  if (allowedRoles.includes(user.role)) {
    return true;
  }

  return user.roles?.some((role) => allowedRoles.includes(role)) ?? false;
}
