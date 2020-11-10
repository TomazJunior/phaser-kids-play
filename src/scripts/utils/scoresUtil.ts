import { MINIMUM_ROUNDS_TO_GAIN_ONE_STAR, MINIMUM_ROUNDS_TO_GAIN_TWO_STARS } from "./constants"

export const calculateStars = (round: number): number => {
  if (round >= MINIMUM_ROUNDS_TO_GAIN_TWO_STARS) {
    return 2
  } else if (round >= MINIMUM_ROUNDS_TO_GAIN_ONE_STAR) {
    return 1
  }
  return 0
}

export const calculateGems = (stars: number, firstTime: boolean = false): number => {
  if (stars === 3) {
    return 40
  } else if (stars === 2) {
    return 15
  } else if (stars === 1) {
    return 5
  }
  return 0
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
