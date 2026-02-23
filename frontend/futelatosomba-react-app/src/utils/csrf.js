// CSRF utility for double-submit cookie pattern
// The backend sets a 'csrf-token' cookie and the frontend must echo it back
// via the 'x-csrf-token' header on state-changing requests.

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
const CSRF_TOKEN_URL = `${API_BASE_URL}/csrf-token`;
const CSRF_COOKIE_NAME = 'csrf-token';
export const CSRF_HEADER_NAME = 'x-csrf-token';

let cachedCsrfToken = null;

// Read the CSRF token from the cookie (set by the backend middleware)
const getTokenFromCookie = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${CSRF_COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

// Fetch the CSRF token from the backend endpoint (also sets the cookie)
export const fetchCsrfToken = async () => {
  // First try reading from cookie (avoids network request)
  const cookieToken = getTokenFromCookie();
  if (cookieToken) {
    cachedCsrfToken = cookieToken;
    return cachedCsrfToken;
  }

  try {
    const response = await fetch(CSRF_TOKEN_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      console.warn(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch CSRF token: ${response.statusText}`);
    }

    const data = await response.json();
    cachedCsrfToken = data.csrfToken;
    return cachedCsrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error.message);
    return null;
  }
};

// Get the current CSRF token (cookie -> cache -> fetch)
export const getCsrfToken = async () => {
  // Prefer the cookie value (always up to date with what the server set)
  const cookieToken = getTokenFromCookie();
  if (cookieToken) {
    cachedCsrfToken = cookieToken;
    return cachedCsrfToken;
  }
  if (cachedCsrfToken) {
    return cachedCsrfToken;
  }
  return await fetchCsrfToken();
};

// Invalidate cached token (call on 403 CSRF errors to force re-fetch)
export const invalidateCsrfToken = () => {
  cachedCsrfToken = null;
};

// Get the CSRF header object for Axios/Fetch
export const getCsrfHeader = async () => {
  const token = await getCsrfToken();
  if (token) {
    return { [CSRF_HEADER_NAME]: token };
  }
  return {};
};
