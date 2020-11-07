export const calculateStars = (round: number, totalRounds: number): number => {
  if (round >= totalRounds) {
    return 3
  } else if (round > 3) {
    return 2
  } else if (round > 1) {
    return 1
  }
  return 0
}
