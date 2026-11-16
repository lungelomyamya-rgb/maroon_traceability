// Older versions saved every signup's name, email, phone and company name under this
// browser key. Nothing ever read it, so the app now only deletes it.
const LEGACY_LEADS_STORAGE_KEY = 'maroon_registration_leads';

export function clearLegacyRegistrationLeads(): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.removeItem(LEGACY_LEADS_STORAGE_KEY);
  } catch {
    // Storage can be blocked (private mode, browser settings); nothing to clean up then
  }
}

export function getRoleDashboardPath(role: string): string {
  const roleDashboardMap: Record<string, string> = {
    farmer: '/farmer',
    inspector: '/inspector',
    logistics: '/logistics',
    packaging: '/packaging',
    retailer: '/retailer',
    public: '/public',
    government: '/government',
    saps: '/saps',
    admin: '/admin',
  };
  return roleDashboardMap[role] ?? '/farmer';
}