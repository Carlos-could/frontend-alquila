export const USER_ROLES = ["inquilino", "propietario", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const DEFAULT_USER_ROLE: UserRole = "inquilino";

export const ROUTE_PERMISSIONS: ReadonlyArray<{
  pathPrefix: string;
  allowedRoles: readonly UserRole[];
}> = [
  {
    pathPrefix: "/admin",
    allowedRoles: ["admin"],
  },
  {
    pathPrefix: "/propietario",
    allowedRoles: ["propietario", "admin"],
  },
  {
    pathPrefix: "/inquilino",
    allowedRoles: ["inquilino", "propietario", "admin"],
  },
];

export function parseUserRole(value: unknown): UserRole {
  if (typeof value !== "string") {
    return DEFAULT_USER_ROLE;
  }

  return USER_ROLES.includes(value as UserRole) ? (value as UserRole) : DEFAULT_USER_ROLE;
}

export function getAllowedRolesForPath(pathname: string): readonly UserRole[] | null {
  const match = ROUTE_PERMISSIONS.find((route) => pathname === route.pathPrefix || pathname.startsWith(`${route.pathPrefix}/`));
  return match?.allowedRoles ?? null;
}

export function canAccessPath(role: UserRole, pathname: string): boolean {
  const allowedRoles = getAllowedRolesForPath(pathname);
  if (!allowedRoles) {
    return true;
  }

  return allowedRoles.includes(role);
}
