import { buildCurrentPath, getDefaultBackLabel } from './navigationContext'

const SORT_LABEL_BY_API_VALUE = {
  relevancy: 'Relevancy',
  rating: 'Rating',
  deadline: 'Deadline',
}

const ALLOWED_RADII = new Set(['5', '10', '25', '50', '100'])

export const parseBooleanParam = (value) => value === 'true' || value === '1'

export const parseCsvParam = (value) =>
  value
    ? [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))]
    : []

export const areArraysEqual = (left, right) =>
  left.length === right.length && left.every((value, index) => value === right[index])

export const areCoordsEqual = (left, right) => {
  if (!left && !right) {
    return true
  }

  if (!left || !right) {
    return false
  }

  return left.lat === right.lat && left.lng === right.lng
}

export const sortToApiValue = (sortBy) => {
  switch (sortBy) {
    case 'Rating':
      return 'rating'
    case 'Deadline':
      return 'deadline'
    default:
      return 'relevancy'
  }
}

export const parseSearchStateFromParams = (searchParams) => {
  const searchQuery = (searchParams.get('q') || '').trim()
  const rawPage = Number.parseInt(searchParams.get('page') || '1', 10)
  const parsedSort = SORT_LABEL_BY_API_VALUE[searchParams.get('sort')] || 'Relevancy'

  return {
    searchInput: searchQuery,
    searchQuery,
    typeFilter: searchParams.get('type') || '',
    ratingFilter: searchParams.get('rating') || '',
    impactFilter: searchParams.get('impact') || '',
    isSelective: parseBooleanParam(searchParams.get('isSelective')),
    locationInput: '',
    onlineOnly: false,
    internationalFilter: parseBooleanParam(searchParams.get('international')),
    creditFilter: parseBooleanParam(searchParams.get('collegeCredit')),
    oneOnOneFilter: parseBooleanParam(searchParams.get('oneOnOne')),
    includeOnline: true,
    seasonFilter: searchParams.get('season') || '',
    gradesFilter: parseCsvParam(searchParams.get('grades')),
    interestIds: parseCsvParam(searchParams.get('interests')),
    radiusMiles: ALLOWED_RADII.has(searchParams.get('radiusMiles')) ? searchParams.get('radiusMiles') : '25',
    radiusFilterEnabled: false,
    currentCoords: null,
    locationStatus: '',
    locationError: '',
    sortBy: parsedSort === 'Distance' ? 'Relevancy' : parsedSort,
    page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1,
  }
}

export const buildSearchParamsFromState = ({
  searchQuery,
  typeFilter,
  ratingFilter,
  impactFilter,
  isSelective,
  locationInput,
  onlineOnly,
  internationalFilter,
  creditFilter,
  oneOnOneFilter,
  includeOnline,
  seasonFilter,
  gradesFilter,
  interestIds,
  radiusMiles,
  radiusFilterEnabled,
  currentCoords,
  sortBy,
  page,
}) => {
  const nextParams = new URLSearchParams()

  if (searchQuery) {
    nextParams.set('q', searchQuery)
  }

  if (typeFilter) {
    nextParams.set('type', typeFilter)
  }

  if (ratingFilter) {
    nextParams.set('rating', ratingFilter)
  }

  if (impactFilter) {
    nextParams.set('impact', impactFilter)
  }

  if (isSelective) {
    nextParams.set('isSelective', 'true')
  }

  if (internationalFilter) {
    nextParams.set('international', 'true')
  }

  if (creditFilter) {
    nextParams.set('collegeCredit', 'true')
  }

  if (oneOnOneFilter) {
    nextParams.set('oneOnOne', 'true')
  }

  if (seasonFilter) {
    nextParams.set('season', seasonFilter)
  }

  if (gradesFilter.length > 0) {
    nextParams.set('grades', gradesFilter.join(','))
  }

  if (interestIds.length > 0) {
    nextParams.set('interests', interestIds.join(','))
  }

  const apiSortValue = sortToApiValue(sortBy)
  if (apiSortValue !== 'relevancy') {
    nextParams.set('sort', apiSortValue)
  }

  if (page > 1) {
    nextParams.set('page', String(page))
  }

  return nextParams
}

export const buildSearchPath = (params = {}, location = null, overrides = {}) => {
  const searchParams = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  )

  if (location && !location.pathname.startsWith('/search')) {
    const inheritedParams = new URLSearchParams(location.search)
    const inheritedReturnTo = inheritedParams.get('returnTo') || ''
    const inheritedReturnLabel = inheritedParams.get('returnLabel') || ''

    searchParams.set('returnTo', overrides.returnTo || inheritedReturnTo || buildCurrentPath(location))
    searchParams.set('returnLabel', overrides.returnLabel || inheritedReturnLabel || getDefaultBackLabel(location.pathname))
  }

  const query = searchParams.toString()
  return `/search${query ? `?${query}` : ''}`
}
