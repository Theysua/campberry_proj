const SORT_LABEL_BY_API_VALUE = {
  relevancy: 'Relevancy',
  rating: 'Rating',
  deadline: 'Deadline',
  distance: 'Distance',
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
    case 'Distance':
      return 'distance'
    default:
      return 'relevancy'
  }
}

export const parseSearchStateFromParams = (searchParams) => {
  const searchQuery = (searchParams.get('q') || '').trim()
  const lat = Number(searchParams.get('lat'))
  const lng = Number(searchParams.get('lng'))
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng)
  const currentCoords = hasCoords
    ? {
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
      }
    : null

  const onlineOnly = parseBooleanParam(searchParams.get('onlineOnly'))
  const includeOnlineParam = searchParams.get('includeOnline')
  const includeOnline = onlineOnly
    ? true
    : includeOnlineParam === null
      ? true
      : parseBooleanParam(includeOnlineParam)
  const radiusMiles = ALLOWED_RADII.has(searchParams.get('radiusMiles'))
    ? searchParams.get('radiusMiles')
    : '25'
  const rawPage = Number.parseInt(searchParams.get('page') || '1', 10)

  return {
    searchInput: searchQuery,
    searchQuery,
    typeFilter: searchParams.get('type') || '',
    ratingFilter: searchParams.get('rating') || '',
    isFree: parseBooleanParam(searchParams.get('isFree')),
    isSelective: parseBooleanParam(searchParams.get('isSelective')),
    locationInput: searchParams.get('location') || '',
    onlineOnly,
    internationalFilter: parseBooleanParam(searchParams.get('international')),
    creditFilter: parseBooleanParam(searchParams.get('collegeCredit')),
    oneOnOneFilter: parseBooleanParam(searchParams.get('oneOnOne')),
    includeOnline,
    seasonFilter: searchParams.get('season') || '',
    gradesFilter: parseCsvParam(searchParams.get('grades')),
    interestIds: parseCsvParam(searchParams.get('interests')),
    radiusMiles,
    currentCoords,
    locationStatus: currentCoords ? 'Using a location-based search area' : '',
    locationError: '',
    sortBy: SORT_LABEL_BY_API_VALUE[searchParams.get('sort')] || 'Relevancy',
    page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1,
  }
}

export const buildSearchParamsFromState = ({
  searchQuery,
  typeFilter,
  ratingFilter,
  isFree,
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

  if (isFree) {
    nextParams.set('isFree', 'true')
  }

  if (isSelective) {
    nextParams.set('isSelective', 'true')
  }

  if (locationInput) {
    nextParams.set('location', locationInput)
  }

  if (onlineOnly) {
    nextParams.set('onlineOnly', 'true')
  } else if (!includeOnline) {
    nextParams.set('includeOnline', 'false')
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

  if (currentCoords) {
    nextParams.set('lat', String(currentCoords.lat))
    nextParams.set('lng', String(currentCoords.lng))
    nextParams.set('radiusMiles', radiusMiles)
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

export const buildSearchPath = (params = {}) => {
  const searchParams = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  )
  const query = searchParams.toString()
  return `/search${query ? `?${query}` : ''}`
}
