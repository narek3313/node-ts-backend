export const USER_ROLES = ['admin', 'user', 'moderator'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_SET = new Set<UserRole>(USER_ROLES);

export function isValidUserRole(role: string): role is UserRole {
    return USER_ROLE_SET.has(role as UserRole);
}
