const PREVIEW_STORAGE_KEY = 'campberry_guest_preview_v1'
export const MAX_GUEST_PROGRAM_VIEWS = 10

const readStoredState = () => {
  if (typeof window === 'undefined') {
    return { viewedProgramIds: [], count: 0 }
  }

  try {
    const raw = window.localStorage.getItem(PREVIEW_STORAGE_KEY)
    if (!raw) {
      return { viewedProgramIds: [], count: 0 }
    }

    const parsed = JSON.parse(raw)
    const viewedProgramIds = Array.isArray(parsed?.viewedProgramIds)
      ? [...new Set(parsed.viewedProgramIds.filter(Boolean))]
      : []

    return {
      viewedProgramIds,
      count: viewedProgramIds.length,
    }
  } catch {
    return { viewedProgramIds: [], count: 0 }
  }
}

const writeStoredState = (state) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(state))
}

export const getGuestPreviewState = () => {
  const state = readStoredState()
  return {
    ...state,
    remaining: Math.max(0, MAX_GUEST_PROGRAM_VIEWS - state.count),
    registrationRequired: state.count >= MAX_GUEST_PROGRAM_VIEWS,
  }
}

export const canGuestAccessProgram = (programId) => {
  const state = readStoredState()
  if (state.viewedProgramIds.includes(programId)) {
    return true
  }

  return state.count < MAX_GUEST_PROGRAM_VIEWS
}

export const recordGuestProgramView = (programId) => {
  const state = readStoredState()
  if (!programId || state.viewedProgramIds.includes(programId)) {
    return {
      ...state,
      remaining: Math.max(0, MAX_GUEST_PROGRAM_VIEWS - state.count),
      registrationRequired: state.count >= MAX_GUEST_PROGRAM_VIEWS,
    }
  }

  const nextState = {
    viewedProgramIds: [...state.viewedProgramIds, programId],
  }
  writeStoredState(nextState)
  return getGuestPreviewState()
}

export const clearGuestPreviewState = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(PREVIEW_STORAGE_KEY)
}
