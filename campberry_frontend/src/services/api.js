import {
  getDemoInterests,
  getDemoListById,
  getDemoLists,
  getDemoProgramById,
  getDemoPrograms,
} from '../mocks/demoData'
import {
  demoAddListItem,
  demoCreateList,
  demoDeleteList,
  demoGetMe,
  demoGetMyListById,
  demoGetMyLists,
  demoGetSavedPrograms,
  demoLogin,
  demoLogout,
  demoRegister,
  demoRemoveListItem,
  demoSaveProgram,
  demoUnsaveProgram,
  demoUpdateList,
  demoUpdateListItem,
} from '../mocks/demoPrivateData'

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001/api/v1' : '')

export const isDemoMode = !API_BASE
const PUBLIC_CACHE_PREFIX = 'campberry_public_cache_v1'
const memoryCache = new Map()
const PROGRAMS_CACHE_TTL_MS = 5 * 60 * 1000
const INTERESTS_CACHE_TTL_MS = 60 * 60 * 1000
const DETAIL_CACHE_TTL_MS = 10 * 60 * 1000

const canUseSessionStorage = () => typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'

const requireApiBase = () => {
  if (API_BASE) {
    return API_BASE
  }

  throw new Error('API is not configured. Set VITE_API_URL for production builds.')
}

const requireLiveApi = (message = 'This feature will be available once the backend is online.') => {
  if (!isDemoMode) {
    return
  }

  throw new Error(message)
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

const getCacheKey = (endpoint) => `${PUBLIC_CACHE_PREFIX}:${endpoint}`

const readCachedValue = (endpoint) => {
  const key = getCacheKey(endpoint)
  const memoryEntry = memoryCache.get(key)
  if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
    return memoryEntry.data
  }

  if (!canUseSessionStorage()) {
    return null
  }

  try {
    const raw = window.sessionStorage.getItem(key)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    if (!parsed?.expiresAt || parsed.expiresAt <= Date.now()) {
      window.sessionStorage.removeItem(key)
      return null
    }

    memoryCache.set(key, parsed)
    return parsed.data
  } catch {
    return null
  }
}

const writeCachedValue = (endpoint, data, ttlMs) => {
  const entry = {
    data,
    expiresAt: Date.now() + ttlMs,
  }
  const key = getCacheKey(endpoint)
  memoryCache.set(key, entry)

  if (!canUseSessionStorage()) {
    return
  }

  try {
    window.sessionStorage.setItem(key, JSON.stringify(entry))
  } catch {
    // Ignore storage quota or serialization issues and keep the in-memory cache only.
  }
}

const cachedPublicFetch = async (endpoint, ttlMs, options = {}) => {
  const cached = readCachedValue(endpoint)
  if (cached) {
    return cached
  }

  const data = await apiFetch(endpoint, options)
  writeCachedValue(endpoint, data, ttlMs)
  return data
}

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
  isDemoMode
    ? demoLogin(email, password)
    : apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

export const loginWithGoogle = (credential) =>
  isDemoMode
    ? Promise.reject(new Error('Demo mode: Google sign-in will be available after the backend goes live.'))
    : apiFetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential }),
      })

export const register = (name, email, password) =>
  isDemoMode
    ? demoRegister(name, email, password)
    : apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })

export const requestPasswordReset = (email) =>
  (requireLiveApi(), apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }))

export const resetPassword = (token, password) =>
  (requireLiveApi(), apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  }))

export const logoutUser = () =>
  isDemoMode
    ? demoLogout()
    : apiFetch('/auth/logout', {
        method: 'POST',
      })

export const getMe = () =>
  isDemoMode
    ? demoGetMe()
    : apiFetch('/me')

export const getPrograms = (params = {}, options = {}) => {
  if (isDemoMode) {
    return Promise.resolve(getDemoPrograms(params))
  }

  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '' && value !== null && value !== false)
  ).toString()

  return cachedPublicFetch(`/programs${query ? `?${query}` : ''}`, PROGRAMS_CACHE_TTL_MS, options)
}

export const getProgramById = (id) =>
  isDemoMode ? Promise.resolve(getDemoProgramById(id)) : cachedPublicFetch(`/programs/${id}`, DETAIL_CACHE_TTL_MS)
export const getProgramFeedback = (id) =>
  isDemoMode ? Promise.resolve(getDemoProgramById(id).feedback_preview || []) : cachedPublicFetch(`/programs/${id}/feedback`, DETAIL_CACHE_TTL_MS)
export const submitProgramFeedback = (programId, rating, comment = '') =>
  (requireLiveApi(), apiFetch(`/me/programs/${programId}/feedback`, {
    method: 'POST',
    body: JSON.stringify({ rating, comment }),
  }))
export const getInterests = () =>
  isDemoMode ? Promise.resolve(getDemoInterests()) : cachedPublicFetch('/interests', INTERESTS_CACHE_TTL_MS)

export const getSavedPrograms = () =>
  isDemoMode ? demoGetSavedPrograms() : apiFetch('/me/saved-programs')
export const getSavedLists = () =>
  (requireLiveApi(), apiFetch('/me/saved-lists'))
export const saveProgram = (programId) =>
  (isDemoMode
    ? demoSaveProgram(programId)
    : apiFetch('/me/saved-programs', {
        method: 'POST',
        body: JSON.stringify({ programId }),
      }))
export const unsaveProgram = (programId) =>
  (isDemoMode
    ? demoUnsaveProgram(programId)
    : apiFetch(`/me/saved-programs/${programId}`, {
        method: 'DELETE',
      }))
export const saveList = (listId) =>
  (requireLiveApi(), apiFetch('/me/saved-lists', {
    method: 'POST',
    body: JSON.stringify({ listId }),
  }))
export const unsaveList = (listId) =>
  (requireLiveApi(), apiFetch(`/me/saved-lists/${listId}`, {
    method: 'DELETE',
  }))

export const getLists = () =>
  isDemoMode ? Promise.resolve(getDemoLists()) : cachedPublicFetch('/lists', DETAIL_CACHE_TTL_MS)
export const getListById = (id) =>
  isDemoMode ? Promise.resolve(getDemoListById(id)) : cachedPublicFetch(`/lists/${id}`, DETAIL_CACHE_TTL_MS)
export const getListFeedback = (id) =>
  isDemoMode ? Promise.resolve(getDemoListById(id).feedback_preview || []) : cachedPublicFetch(`/lists/${id}/feedback`, DETAIL_CACHE_TTL_MS)
export const submitListFeedback = (listId, rating, comment = '') =>
  (requireLiveApi(), apiFetch(`/me/lists/${listId}/feedback`, {
    method: 'POST',
    body: JSON.stringify({ rating, comment }),
  }))
export const getMyLists = () => (isDemoMode ? demoGetMyLists() : apiFetch('/me/lists'))
export const getMyListById = (id) => (isDemoMode ? demoGetMyListById(id) : apiFetch(`/me/lists/${id}`))
export const createList = (title, description, isPublic = false) =>
  (isDemoMode
    ? demoCreateList(title, description, isPublic)
    : apiFetch('/me/lists', {
        method: 'POST',
        body: JSON.stringify({ title, description, isPublic }),
      }))
export const updateList = (id, title, description, isPublic) =>
  (isDemoMode
    ? demoUpdateList(id, title, description, isPublic)
    : apiFetch(`/me/lists/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, description, isPublic }),
      }))
export const deleteList = (id) =>
  (isDemoMode
    ? demoDeleteList(id)
    : apiFetch(`/me/lists/${id}`, {
        method: 'DELETE',
      }))
export const addListItem = (listId, programId, commentary = '') =>
  (isDemoMode
    ? demoAddListItem(listId, programId, commentary)
    : apiFetch(`/me/lists/${listId}/items`, {
        method: 'POST',
        body: JSON.stringify({ programId, commentary }),
      }))
export const updateListItem = (listId, itemId, commentary, displayOrder) =>
  (isDemoMode
    ? demoUpdateListItem(listId, itemId, commentary, displayOrder)
    : apiFetch(`/me/lists/${listId}/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ commentary, displayOrder }),
      }))
export const removeListItem = (listId, itemId) =>
  (isDemoMode
    ? demoRemoveListItem(listId, itemId)
    : apiFetch(`/me/lists/${listId}/items/${itemId}`, {
        method: 'DELETE',
      }))

export const warmSearchBootstrapCache = async () => {
  if (isDemoMode) {
    return
  }

  await Promise.allSettled([
    getPrograms({ page: 1, limit: 10 }),
    getInterests(),
  ])
}
