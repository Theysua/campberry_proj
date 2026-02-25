const API_BASE = 'http://localhost:3000/api/v1';

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
    if (endpoint.startsWith('/programs') && (!options.method || options.method === 'GET')) {
      console.warn('API error, falling back to mock data', error);
      // Fallback logic for programs array inside Search.jsx
      return { _mocked_programs: true };
    }
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

export const getMe = () => apiFetch('/me');

import localProgramsData from '../data/detailed_programs.json';

// Programs
export const getPrograms = async (queryParams = '') => {
  try {
    const res = await apiFetch(`/programs${queryParams}`);
    if (res._mocked_programs) throw new Error("Mocked");
    return res;
  } catch (err) {
    const data = localProgramsData.map(p => ({
      ...p.trpcData,
      is_highly_selective: p.trpcData.isHighlySelective,
      experts_choice_rating: p.trpcData.expertsChoiceRating,
      only_us_citizens: p.trpcData.onlyUsCitizens,
      only_us_residents: p.trpcData.onlyUsResidents,
      eligible_grades: p.trpcData.eligibleGrades,
      logo_url: p.trpcData.logo?.url,
      interests: p.trpcData.interests?.map(i => ({ interest: i })) || []
    }));
    return { data };
  }
};
export const getProgramById = async (id) => {
  try {
    const res = await apiFetch(`/programs/${id}`);
    if (res._mocked_programs) throw new Error("Mocked");
    return res;
  } catch (err) {
    const p = localProgramsData.find(prog => prog.id === id);
    if (!p) return null;
    return {
      ...p.trpcData,
      name: p.trpcData.name,
      provider: p.trpcData.provider,
      description: p.trpcData.description,
      is_highly_selective: p.trpcData.isHighlySelective,
      experts_choice_rating: p.trpcData.expertsChoiceRating,
      cost_info: p.trpcData.costInfo,
      admission_info: p.trpcData.admissionInfo,
      eligibility_info: p.trpcData.eligibilityInfo,
      eligible_grades: p.trpcData.eligibleGrades,
      logo_url: p.trpcData.logo?.url,
      interests: p.trpcData.interests?.map(i => ({ interest: i })) || [],
      url: p.trpcData.url
    };
  }
};

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
export const createList = (title, description) => apiFetch('/me/lists', {
  method: 'POST',
  body: JSON.stringify({ title, description, isPublic: true })
});
export const deleteList = (id) => apiFetch(`/me/lists/${id}`, {
  method: 'DELETE'
});
export const addListItem = (listId, programId, commentary = '') => apiFetch(`/me/lists/${listId}/items`, {
  method: 'POST',
  body: JSON.stringify({ programId, commentary })
});
export const removeListItem = (listId, itemId) => apiFetch(`/me/lists/${listId}/items/${itemId}`, {
  method: 'DELETE'
});
