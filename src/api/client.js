// MERN API Client with JWT authorization & error handling (Pure JavaScript)

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, status, code, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export async function apiRequest(endpoint, options = {}) {
  const { params, headers: customHeaders, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const token = localStorage.getItem('saree_web_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customHeaders || {}),
  };

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data?.code, data);
    }

    return data?.data !== undefined ? data.data : data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error?.message || 'Network error occurred. Backend may be offline.', 0, 'NETWORK_ERROR');
  }
}

export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => 
    apiRequest(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined, ...options }),
  put: (endpoint, body, options) => 
    apiRequest(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined, ...options }),
  patch: (endpoint, body, options) => 
    apiRequest(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined, ...options }),
  delete: (endpoint, options) => 
    apiRequest(endpoint, { method: 'DELETE', ...options }),
};
