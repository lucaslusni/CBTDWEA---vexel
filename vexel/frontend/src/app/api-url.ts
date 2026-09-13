// Only explicitly configured API URLs receive the user's bearer token.
// Relative URLs are left untouched: the current API services use absolute URLs.
export function isApiUrl(requestUrl: string, apiUrl: string): boolean {
  try {
    const request = new URL(requestUrl);
    const api = new URL(apiUrl);
    if (!['http:', 'https:'].includes(api.protocol)) return false;
    if (request.username || request.password) return false;
    if (request.origin !== api.origin) return false;

    const basePath = api.pathname.replace(/\/+$/, '');
    return request.pathname === basePath || request.pathname.startsWith(basePath + '/');
  } catch {
    return false;
  }
}

