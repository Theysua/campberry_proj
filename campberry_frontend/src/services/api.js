const API_BASE = 'http://localhost:3001/api/v1';

export const getAuthToken = () => localStorage.getItem('campberry_token');
export const setAuthToken = (token) => {
  localStorage.setItem('campberry_auth', 'true');
  localStorage.setItem('campberry_token', token);
};
export const clearAuthToken = () => {
  localStorage.removeItem('campberry_auth');
  localStorage.removeItem('campberry_token');
};

const defaultHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  try {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers: {
        ...defaultHeaders(),
        ...options.headers
      }
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'API Request Failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth
export const login = (email, password) => apiFetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

export const register = (name, email, password) => apiFetch('/auth/register', {
  method: 'POST',
  body: JSON.stringify({ name, email, password })
});

export const logoutUser = () => apiFetch('/auth/logout', {
  method: 'POST'
});

export const getMe = () => apiFetch('/me');

// Programs
export const getPrograms = (queryParams = '') => apiFetch(`/programs${queryParams}`);
export const getProgramById = (id) => apiFetch(`/programs/${id}`);

// Saved Programs
export const getSavedPrograms = () => apiFetch('/me/saved-programs');
export const saveProgram = (programId) => apiFetch('/me/saved-programs', {
  method: 'POST',
  body: JSON.stringify({ programId })
});
export const unsaveProgram = (programId) => apiFetch(`/me/saved-programs/${programId}`, {
  method: 'DELETE'
});

// Lists
export const getLists = () => apiFetch('/lists');
export const getListById = (id) => apiFetch(`/lists/${id}`);
export const getMyLists = () => apiFetch('/me/lists');
export const createList = (title, description, isPublic = true) => apiFetch('/me/lists', {
  method: 'POST',
  body: JSON.stringify({ title, description, isPublic })
});
export const updateList = (id, title, description, isPublic) => apiFetch(`/me/lists/${id}`, {
  method: 'PUT',
  body: JSON.stringify({ title, description, isPublic })
});
export const deleteList = (id) => apiFetch(`/me/lists/${id}`, {
  method: 'DELETE'
});
export const addListItem = (listId, programId, commentary = '') => apiFetch(`/me/lists/${listId}/items`, {
  method: 'POST',
  body: JSON.stringify({ programId, commentary })
});
export const updateListItem = (listId, itemId, commentary, displayOrder) => apiFetch(`/me/lists/${listId}/items/${itemId}`, {
  method: 'PUT',
  body: JSON.stringify({ commentary, displayOrder })
});
export const removeListItem = (listId, itemId) => apiFetch(`/me/lists/${listId}/items/${itemId}`, {
  method: 'DELETE'
});
