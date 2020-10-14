import { ANIMAL_SKINS } from './constants'

export const getAllSkins = (): ANIMAL_SKINS[] => {
  return Object.keys(ANIMAL_SKINS).map((key) => {
    return ANIMAL_SKINS[key]
  })
}

export const getSkin = (text: string): ANIMAL_SKINS | null => {
  const foundKey = Object.keys(ANIMAL_SKINS).find((key) => {
    return ANIMAL_SKINS[key].toString() === text
  })
  return foundKey ? ANIMAL_SKINS[foundKey] : null
}

export const getRandomSkin = (): ANIMAL_SKINS => {
  const allSkins = getAllSkins()
  const randomIndex = Math.floor(Math.random() * (allSkins.length - 1))
  return allSkins[randomIndex]
}

export const getARandomSkinFrom = (availableSkins: ANIMAL_SKINS[], removeFromList = true): ANIMAL_SKINS => {
  const randomIndex = Math.floor(Math.random() * (availableSkins.length - 1))
  if (removeFromList) {
    return availableSkins.splice(randomIndex, 1)[0]
  }
  return availableSkins[randomIndex]
}
