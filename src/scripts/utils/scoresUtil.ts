import { MINIMUM_ROUNDS_TO_GAIN_ONE_STAR, MINIMUM_ROUNDS_TO_GAIN_TWO_STARS, SCORE_BY_STAR, SCORE_PER_HIDDEN_CHAR } from './constants'

export const calculateStars = (round: number): number => {
  if (round >= MINIMUM_ROUNDS_TO_GAIN_TWO_STARS) {
    return 2
  } else if (round >= MINIMUM_ROUNDS_TO_GAIN_ONE_STAR) {
    return 1
  }
  return 0
}

export const calculateGems = (stars: number, currentLevelStorge: LevelFileStorageConfig | undefined): number => {
  if (currentLevelStorge && currentLevelStorge.stars >= stars) return 0
  const currentLevelStars = currentLevelStorge?.stars || 0
  const firstAttempt = !currentLevelStorge || currentLevelStorge.attempts === 0
  const diffStars: number = stars - currentLevelStars

  const maxPoints = Object.values(SCORE_BY_STAR).reduce((v, sum) => v + sum, 0)
  
  const value = Object.keys(SCORE_BY_STAR)
    .filter((starNumber) => parseInt(starNumber) <= stars)
    .reverse()
    .filter((starNumber, index) => diffStars > index)
    .reduce((sum, starNumber) => {
      const value = SCORE_BY_STAR[starNumber]
      return sum + value
    }, 0)

  if (value === maxPoints && firstAttempt) {
    // give extra points for being perfect
    return value + SCORE_PER_HIDDEN_CHAR
  } else {
    return value
  }
}

export const getStarImageName = (stars: number | undefined): string => {
  let imageName = ''
  switch (stars) {
    case 3:
      imageName = 'stars-three'
      break
    case 2:
      imageName = 'stars-two'
      break
    case 1:
      imageName = 'stars-one'
      break
    default:
      imageName = 'stars-zero'
      break
  }
  return imageName
}
