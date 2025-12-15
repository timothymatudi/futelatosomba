// futelatosomba/frontend/futelatosomba-react-app/src/utils/csrf.js

// Get API base URL from environment or use default
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://futelatosomba-ldho.onrender.com/api';
const CSRF_TOKEN_URL = `${API_BASE_URL}/csrf-token`;
export const CSRF_HEADER_NAME = 'x-csrf-token';

let cachedCsrfToken = null;

// Function to fetch the CSRF token from the backend
export const fetchCsrfToken = async () => {
  if (cachedCsrfToken) {
    return cachedCsrfToken;
  }

  try {
    const response = await fetch(CSRF_TOKEN_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: Include cookies in the request
    });

    if (!response.ok) {
      console.warn(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch CSRF token: ${response.statusText}`);
    }

    const data = await response.json();
    cachedCsrfToken = data.csrfToken;
    console.log('CSRF token fetched successfully');
    return cachedCsrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error.message);
    // Don't throw error, just return null to allow app to continue
    // The interceptor will try to get the token again when needed
    return null;
  }
};

// Function to get the current CSRF token (either cached or fetched)
export const getCsrfToken = async () => {
  if (cachedCsrfToken) {
    return cachedCsrfToken;
  }
  return await fetchCsrfToken();
};

// Function to get the CSRF header object for Axios/Fetch
export const getCsrfHeader = async () => {
  const token = await getCsrfToken();
  if (token) {
    return { [CSRF_HEADER_NAME]: token };
  }
  return {};
};
