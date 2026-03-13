export const buildCurrentPath = (location) => `${location.pathname}${location.search || ''}`

export const getDefaultBackLabel = (pathname) => {
  if (pathname.startsWith('/search')) {
    return 'Back to Search'
  }

  if (pathname.startsWith('/my-lists/')) {
    return 'Back to My List'
  }

  if (pathname === '/my-lists' || pathname === '/account/lists') {
    return 'Back to My Lists'
  }

  if (pathname.startsWith('/saved-programs')) {
    return 'Back to Saved Programs'
  }

  if (pathname.startsWith('/compare')) {
    return 'Back to Compare'
  }

  if (pathname.startsWith('/lists/')) {
    return 'Back to List'
  }

  if (pathname.startsWith('/lists')) {
    return 'Back to Lists'
  }

  if (pathname === '/') {
    return 'Back to Home'
  }

  return 'Back'
}

export const readNavigationContext = (search) => {
  const params = new URLSearchParams(search)

  return {
    returnTo: params.get('returnTo') || '',
    returnLabel: params.get('returnLabel') || '',
    targetListId: params.get('targetListId') || '',
    targetListTitle: params.get('targetListTitle') || '',
    postLoginAction: params.get('postLoginAction') || '',
    actionProgramId: params.get('actionProgramId') || '',
    authReason: params.get('reason') || '',
  }
}

export const withSearchParams = (pathname, paramsToSet = {}) => {
  const params = new URLSearchParams()

  Object.entries(paramsToSet).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, value)
    }
  })

  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

export const replaceSearchParams = (location, updates = {}, keysToDelete = []) => {
  const params = new URLSearchParams(location.search)

  keysToDelete.forEach((key) => params.delete(key))

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      params.delete(key)
      return
    }

    params.set(key, value)
  })

  const query = params.toString()
  return `${location.pathname}${query ? `?${query}` : ''}`
}

export const buildAuthRedirectPath = (location, actionParams = {}) =>
  withSearchParams('/auth', {
    redirect: replaceSearchParams(location, actionParams),
  })

export const buildProgramDetailPath = (programId, location, overrides = {}) => {
  const context = readNavigationContext(location.search)

  return withSearchParams(`/program/${programId}`, {
    returnTo: buildCurrentPath(location),
    returnLabel: overrides.returnLabel || getDefaultBackLabel(location.pathname),
    targetListId: overrides.targetListId || context.targetListId,
    targetListTitle: overrides.targetListTitle || context.targetListTitle,
  })
}

export const getBackTarget = (location, fallbackPath, fallbackLabel) => {
  const context = readNavigationContext(location.search)

  return {
    path: context.returnTo || fallbackPath,
    label: context.returnLabel || fallbackLabel,
    targetListId: context.targetListId,
    targetListTitle: context.targetListTitle,
  }
}
