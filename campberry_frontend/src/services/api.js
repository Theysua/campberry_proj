const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001/api/v1' : '')

const requireApiBase = () => {
  if (API_BASE) {
    return API_BASE
  }

  throw new Error('API is not configured. Set VITE_API_URL for production builds.')
}

export const getAuthToken = () => localStorage.getItem('campberry_token')

export const setAuthToken = (token) => {
  if (!token) {
    return
  }

  localStorage.setItem('campberry_auth', 'true')
  localStorage.setItem('campberry_token', token)
}

export const clearAuthToken = () => {
  localStorage.removeItem('campberry_auth')
  localStorage.removeItem('campberry_token')
}

const defaultHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const refreshAccessToken = async () => {
  const response = await fetch(`${requireApiBase()}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.accessToken) {
    clearAuthToken()
    throw new Error(data.error || 'Session expired')
  }

  setAuthToken(data.accessToken)
  return data.accessToken
}

const shouldAttemptRefresh = (endpoint) =>
  !endpoint.startsWith('/auth/login') &&
  !endpoint.startsWith('/auth/register') &&
  !endpoint.startsWith('/auth/logout') &&
  !endpoint.startsWith('/auth/verify-email') &&
  !endpoint.startsWith('/auth/google') &&
  !endpoint.startsWith('/auth/refresh')

export const apiFetch = async (endpoint, options = {}, allowRetry = true) => {
  const url = `${requireApiBase()}${endpoint}`
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      ...defaultHeaders(),
      ...options.headers,
    },
  })

  if (response.status === 401 && allowRetry && shouldAttemptRefresh(endpoint)) {
    await refreshAccessToken()
    return apiFetch(endpoint, options, false)
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'API Request Failed')
  }

  return data
}

export const login = (email, password) =>
  apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const loginWithGoogle = (credential) =>
  apiFetch('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  })

export const register = (name, email, password) =>
  apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })

export const logoutUser = () =>
  apiFetch('/auth/logout', {
    method: 'POST',
  })

export const getMe = () => apiFetch('/me')

export const getPrograms = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '' && value !== null && value !== false)
  ).toString()

  return apiFetch(`/programs${query ? `?${query}` : ''}`)
}

export const getProgramById = (id) => apiFetch(`/programs/${id}`)
export const getProgramFeedback = (id) => apiFetch(`/programs/${id}/feedback`)
export const submitProgramFeedback = (programId, rating, comment = '') =>
  apiFetch(`/me/programs/${programId}/feedback`, {
    method: 'POST',
    body: JSON.stringify({ rating, comment }),
  })
export const getInterests = () => apiFetch('/interests')

export const getSavedPrograms = () => apiFetch('/me/saved-programs')
export const saveProgram = (programId) =>
  apiFetch('/me/saved-programs', {
    method: 'POST',
    body: JSON.stringify({ programId }),
  })
export const unsaveProgram = (programId) =>
  apiFetch(`/me/saved-programs/${programId}`, {
    method: 'DELETE',
  })

export const getLists = () => apiFetch('/lists')
export const getListById = (id) => apiFetch(`/lists/${id}`)
export const getListFeedback = (id) => apiFetch(`/lists/${id}/feedback`)
export const submitListFeedback = (listId, rating, comment = '') =>
  apiFetch(`/me/lists/${listId}/feedback`, {
    method: 'POST',
    body: JSON.stringify({ rating, comment }),
  })
export const getMyLists = () => apiFetch('/me/lists')
export const getMyListById = (id) => apiFetch(`/me/lists/${id}`)
export const createList = (title, description, isPublic = false) =>
  apiFetch('/me/lists', {
    method: 'POST',
    body: JSON.stringify({ title, description, isPublic }),
  })
export const updateList = (id, title, description, isPublic) =>
  apiFetch(`/me/lists/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, description, isPublic }),
  })
export const deleteList = (id) =>
  apiFetch(`/me/lists/${id}`, {
    method: 'DELETE',
  })
export const addListItem = (listId, programId, commentary = '') =>
  apiFetch(`/me/lists/${listId}/items`, {
    method: 'POST',
    body: JSON.stringify({ programId, commentary }),
  })
export const updateListItem = (listId, itemId, commentary, displayOrder) =>
  apiFetch(`/me/lists/${listId}/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ commentary, displayOrder }),
  })
export const removeListItem = (listId, itemId) =>
  apiFetch(`/me/lists/${listId}/items/${itemId}`, {
    method: 'DELETE',
  })
