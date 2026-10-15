export const SELF_SERVICE_ROLES = [
    'farmer',
    'inspector',
    'logistics',
    'packaging',
    'retailer',
    'public',
] as const;

export type SelfServiceRole = (typeof SELF_SERVICE_ROLES)[number];

export function isSelfServiceRole(role: string): role is SelfServiceRole {
    return (SELF_SERVICE_ROLES as readonly string[]).includes(role);
}