export const hasHighImpactRating = (program) =>
  program?.impact_rating === 'HIGH_IMPACT' || program?.impact_rating === 'MOST_HIGH_IMPACT'

export const getProgramStarRating = (program) => {
  if (program?.experts_choice_rating !== 'MOST_RECOMMENDED') {
    return 0
  }

  if (hasHighImpactRating(program) && program?.is_highly_selective) {
    return 5
  }

  if (hasHighImpactRating(program)) {
    return 4
  }

  return 3
}

export const getProgramRatingScore = (program) => {
  const starRating = getProgramStarRating(program)
  if (starRating > 0) {
    return starRating * 100
  }

  let score = 0

  if (program?.experts_choice_rating === 'HIGHLY_RECOMMENDED') {
    score += 70
  }

  if (program?.impact_rating === 'MOST_HIGH_IMPACT') {
    score += 35
  } else if (program?.impact_rating === 'HIGH_IMPACT') {
    score += 25
  }

  if (program?.is_highly_selective) {
    score += 10
  }

  return score
}
