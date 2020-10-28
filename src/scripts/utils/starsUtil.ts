export const calculateStars = (round: number): number => {
  if (round === 5) {
    return 3
  } else if (round > 3) {
    return 2
  } else if (round > 1) {
    return 1
  }
  return 0
}
