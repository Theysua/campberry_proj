import { getDemoProgramById } from './demoData'

const USERS_KEY = 'campberry_demo_users'
const CURRENT_USER_KEY = 'campberry_demo_current_user_id'
const LISTS_KEY = 'campberry_demo_lists_by_user'
const SAVED_KEY = 'campberry_demo_saved_by_user'

export const DEMO_TEST_ACCOUNT = {
  id: 'demo-user-1',
  name: 'Campberry Demo Student',
  email: 'demo@campberry.com',
  password: 'campberry123',
  role: 'STUDENT',
}

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role || 'STUDENT',
})

const buildDefaultListSeed = (userId) => [
  {
    id: 'demo-my-list-1',
    title: 'Summer Programs to Compare',
    description: 'A starter private list for demo users. Use it to test notes, reordering, and add-to-list flows.',
    is_public: false,
    author_id: userId,
    created_at: '2026-03-01T00:00:00.000Z',
    updated_at: '2026-03-01T00:00:00.000Z',
    items: [
      {
        id: 'demo-my-list-1-item-1',
        program_id: 'demo-program-astro-research',
        author_commentary: 'Strong research signal. Good fit for STEM-heavy applications.',
        display_order: 0,
      },
      {
        id: 'demo-my-list-1-item-2',
        program_id: 'demo-program-young-writers',
        author_commentary: 'Useful contrast option for a humanities angle.',
        display_order: 1,
      },
    ],
  },
  {
    id: 'demo-my-list-2',
    title: 'Affordable Picks',
    description: 'Programs I want to revisit because cost-to-value looks strong.',
    is_public: false,
    author_id: userId,
    created_at: '2026-03-02T00:00:00.000Z',
    updated_at: '2026-03-02T00:00:00.000Z',
    items: [
      {
        id: 'demo-my-list-2-item-1',
        program_id: 'demo-program-startup-sprint',
        author_commentary: 'Free and practical. Worth keeping in the shortlist.',
        display_order: 0,
      },
    ],
  },
]

const ensureDemoStorage = () => {
  const users = readJson(USERS_KEY, null)
  if (!users) {
    writeJson(USERS_KEY, [DEMO_TEST_ACCOUNT])
  }

  const listsByUser = readJson(LISTS_KEY, null)
  if (!listsByUser) {
    writeJson(LISTS_KEY, {
      [DEMO_TEST_ACCOUNT.id]: buildDefaultListSeed(DEMO_TEST_ACCOUNT.id),
    })
  }

  const savedByUser = readJson(SAVED_KEY, null)
  if (!savedByUser) {
    writeJson(SAVED_KEY, {
      [DEMO_TEST_ACCOUNT.id]: ['demo-program-health-policy', 'demo-program-startup-sprint'],
    })
  }
}

const getUsers = () => {
  ensureDemoStorage()
  return readJson(USERS_KEY, [])
}

const setUsers = (users) => writeJson(USERS_KEY, users)

const getListsByUser = () => {
  ensureDemoStorage()
  return readJson(LISTS_KEY, {})
}

const setListsByUser = (value) => writeJson(LISTS_KEY, value)

const getSavedByUser = () => {
  ensureDemoStorage()
  return readJson(SAVED_KEY, {})
}

const setSavedByUser = (value) => writeJson(SAVED_KEY, value)

const getCurrentUserId = () => localStorage.getItem(CURRENT_USER_KEY)

const setCurrentUserId = (userId) => {
  if (userId) {
    localStorage.setItem(CURRENT_USER_KEY, userId)
    return
  }

  localStorage.removeItem(CURRENT_USER_KEY)
}

const getCurrentUserRecord = () => {
  const userId = getCurrentUserId()
  if (!userId) {
    return null
  }

  return getUsers().find((user) => user.id === userId) || null
}

const ensureUserData = (user) => {
  const listsByUser = getListsByUser()
  const savedByUser = getSavedByUser()

  if (!listsByUser[user.id]) {
    listsByUser[user.id] = buildDefaultListSeed(user.id)
    setListsByUser(listsByUser)
  }

  if (!savedByUser[user.id]) {
    savedByUser[user.id] = ['demo-program-health-policy']
    setSavedByUser(savedByUser)
  }
}

const buildListResponse = (list, user) => ({
  ...list,
  author_id: list.author_id,
  author: publicUser(user),
  items: [...(list.items || [])]
    .sort((left, right) => left.display_order - right.display_order)
    .map((item) => ({
      ...item,
      program: getDemoProgramById(item.program_id),
    })),
})

export const demoLogin = async (email, password) => {
  const user = getUsers().find((entry) => entry.email.toLowerCase() === email.trim().toLowerCase())
  if (!user || user.password !== password) {
    throw new Error('Invalid demo credentials.')
  }

  ensureUserData(user)
  setCurrentUserId(user.id)

  return {
    accessToken: `demo-token-${user.id}`,
    user: publicUser(user),
  }
}

export const demoRegister = async (name, email, password) => {
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()
  if (users.some((entry) => entry.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists.')
  }

  const user = {
    id: `demo-user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'STUDENT',
  }

  users.push(user)
  setUsers(users)
  ensureUserData(user)
  setCurrentUserId(user.id)

  return {
    accessToken: `demo-token-${user.id}`,
    user: publicUser(user),
  }
}

export const demoGetMe = async () => {
  const user = getCurrentUserRecord()
  if (!user) {
    throw new Error('Not authenticated')
  }

  ensureUserData(user)
  return publicUser(user)
}

export const demoLogout = async () => {
  setCurrentUserId('')
}

export const demoGetSavedPrograms = async () => {
  const user = getCurrentUserRecord()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const savedByUser = getSavedByUser()
  return (savedByUser[user.id] || []).map((programId) => ({
    id: `saved-${programId}`,
    program: getDemoProgramById(programId),
  }))
}

export const demoSaveProgram = async (programId) => {
  const user = getCurrentUserRecord()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const savedByUser = getSavedByUser()
  const current = new Set(savedByUser[user.id] || [])
  current.add(programId)
  savedByUser[user.id] = [...current]
  setSavedByUser(savedByUser)
  return { success: true }
}

export const demoUnsaveProgram = async (programId) => {
  const user = getCurrentUserRecord()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const savedByUser = getSavedByUser()
  savedByUser[user.id] = (savedByUser[user.id] || []).filter((id) => id !== programId)
  setSavedByUser(savedByUser)
  return { success: true }
}

export const demoGetMyLists = async () => {
  const user = getCurrentUserRecord()
  if (!user) {
    throw new Error('Not authenticated')
  }

  ensureUserData(user)
  const listsByUser = getListsByUser()
  return (listsByUser[user.id] || []).map((list) => buildListResponse(list, user))
}

export const demoGetMyListById = async (listId) => {
  const user = getCurrentUserRecord()
  if (!user) {
    throw new Error('Not authenticated')
  }

  ensureUserData(user)
  const listsByUser = getListsByUser()
  const list = (listsByUser[user.id] || []).find((entry) => entry.id === listId)
  if (!list) {
    throw new Error('List not found')
  }

  return buildListResponse(list, user)
}

export const demoCreateList = async (title, description = '', isPublic = false) => {
  const user = getCurrentUserRecord()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const listsByUser = getListsByUser()
  const nextList = {
    id: `demo-list-${Date.now()}`,
    title,
    description,
    is_public: isPublic,
    author_id: user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: [],
  }

  listsByUser[user.id] = [nextList, ...(listsByUser[user.id] || [])]
  setListsByUser(listsByUser)
  return buildListResponse(nextList, user)
}

export const demoUpdateList = async (listId, title, description, isPublic) => {
  const user = getCurrentUserRecord()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const listsByUser = getListsByUser()
  listsByUser[user.id] = (listsByUser[user.id] || []).map((list) =>
    list.id === listId
      ? {
          ...list,
          title,
          description,
          is_public: isPublic,
          updated_at: new Date().toISOString(),
        }
      : list
  )
  setListsByUser(listsByUser)

  return demoGetMyListById(listId)
}

export const demoDeleteList = async (listId) => {
  const user = getCurrentUserRecord()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const listsByUser = getListsByUser()
  listsByUser[user.id] = (listsByUser[user.id] || []).filter((list) => list.id !== listId)
  setListsByUser(listsByUser)
  return { success: true }
}

export const demoAddListItem = async (listId, programId, commentary = '') => {
  const user = getCurrentUserRecord()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const listsByUser = getListsByUser()
  const targetList = (listsByUser[user.id] || []).find((list) => list.id === listId)
  if (!targetList) {
    throw new Error('List not found')
  }

  const exists = targetList.items.some((item) => item.program_id === programId)
  if (!exists) {
    targetList.items.push({
      id: `demo-list-item-${Date.now()}`,
      program_id: programId,
      author_commentary: commentary,
      display_order: targetList.items.length,
    })
    targetList.updated_at = new Date().toISOString()
    setListsByUser(listsByUser)
  }

  return demoGetMyListById(listId)
}

export const demoUpdateListItem = async (listId, itemId, commentary, displayOrder) => {
  const user = getCurrentUserRecord()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const listsByUser = getListsByUser()
  const targetList = (listsByUser[user.id] || []).find((list) => list.id === listId)
  if (!targetList) {
    throw new Error('List not found')
  }

  targetList.items = targetList.items.map((item) =>
    item.id === itemId
      ? {
          ...item,
          author_commentary: commentary,
          display_order: displayOrder,
        }
      : item
  )
  targetList.updated_at = new Date().toISOString()
  setListsByUser(listsByUser)
  return demoGetMyListById(listId)
}

export const demoRemoveListItem = async (listId, itemId) => {
  const user = getCurrentUserRecord()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const listsByUser = getListsByUser()
  const targetList = (listsByUser[user.id] || []).find((list) => list.id === listId)
  if (!targetList) {
    throw new Error('List not found')
  }

  targetList.items = targetList.items
    .filter((item) => item.id !== itemId)
    .map((item, index) => ({ ...item, display_order: index }))
  targetList.updated_at = new Date().toISOString()
  setListsByUser(listsByUser)
  return demoGetMyListById(listId)
}
