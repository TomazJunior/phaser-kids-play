import { SKINS } from './constants'

export const getAllSkins = (): SKINS[] => {
  return Object.keys(SKINS).map((key) => {
    return SKINS[key]
  })
}
export const getRandomSkin = (): SKINS => {
  const allSkins = getAllSkins()
  const randomIndex = Math.floor(Math.random() * (allSkins.length - 1))
  return allSkins[randomIndex]
}

export const getARandomSkinFrom = (availableSkins: SKINS[], removeFromList = true): SKINS => {
    const randomIndex = Math.floor(Math.random() * (availableSkins.length - 1))
    if (removeFromList) {
        return availableSkins.splice(randomIndex, 1)[0]
    }
    return availableSkins[randomIndex]
  }
