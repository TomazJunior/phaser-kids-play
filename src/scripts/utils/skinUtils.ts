import { SKINS } from "./constants"

export const getRandomSkin = (): SKINS => {
    const allSkins: SKINS[] = Object.keys(SKINS).map(key => {
        return SKINS[key]
    })

    const randomIndex = Math.floor(Math.random() * (allSkins.length - 1))
    return allSkins[randomIndex]
}