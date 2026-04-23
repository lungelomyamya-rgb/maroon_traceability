// src/lib/authClient.ts
// Client-side authentication utilities

/**
 * Get the current auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('access_token');
}

/**
 * Set the auth token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem('access_token', token);
}

/**
 * Remove the auth token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem('access_token');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Get the Authorization header for API requests
 */
export function getAuthHeader(): { Authorization: string } | Record<string, never> {
  const token = getAuthToken();
  
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  
  return {};
}

/**
 * Create headers for authenticated API requests
 */
export function createAuthHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...additionalHeaders,
  };
}
