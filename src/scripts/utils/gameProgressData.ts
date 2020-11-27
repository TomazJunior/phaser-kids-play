import { STORE_KEYS } from './constants'
import { getFromSecureKey, setInSecureKey } from './secureKeyStore'
import { SKILL_ITEM_SKINS } from './skillItems'

const GAME_PROGRESS_STORAGE_KEY = 'gamePogressInfo'

const INITIAL_GAME_PROGRESS_STORAGE: GameProgressData = {
  gems: 0,
  levels: [
    {
      key: '1',
      level: 1,
      stars: 0,
      attempts: 0,
    },
  ],
  skillItems: [],
}

export const incPlayerGems = async (value: number): Promise<void> => {
  const newValue = (await getGems()) + value
  if (newValue < 0) throw new Error('Gems became negative, something wrong happened')
  if (window.cordova) {
    await setInSecureKey(STORE_KEYS.GEMS, newValue)
  } else {
    setFileStorageConfig({
      ...getGameProgressData(),
      gems: newValue,
    })
  }
}

export const getGems = async (): Promise<number> => {
  if (window.cordova) {
    return await getFromSecureKey(STORE_KEYS.GEMS, 0)
  } else {
    return Promise.resolve(getGameProgressData().gems)
  }
}

export const getLevelStorage = async (level: number, key: string): Promise<LevelFileStorageConfig | undefined> => {
  const levels = await getLevels()

  const levelFound = levels.find((item) => item.level === level && item.key === key)
  const levelFileStorage = levelFound ? { ...levelFound } : undefined
  return Promise.resolve(levelFileStorage)
}

export const setLevelStorage = async (data: LevelFileStorageConfig) => {
  const levels = await getLevels()
  const currentLevel = levels.find((item) => item.level === data.level && item.key === data.key)
  const maxStars = Math.max(data.stars, currentLevel?.stars || 0)
  const level: LevelFileStorageConfig = { ...data, attempts: (currentLevel?.attempts || 0) + 1, stars: maxStars }

  const updatedLevels = [...levels.filter((item) => !(item.key === level.key && item.level === level.level)), level]
  if (window.cordova) {
    await setInSecureKey(STORE_KEYS.LEVELS, updatedLevels)
  } else {
    setFileStorageConfig({
      ...getGameProgressData(),
      levels: updatedLevels,
    })
  }
}

export const buySkillItem = async (item: SkillItemDefinition) => {
  const gems = await getGems()
  if (item.itemCost > gems) throw new Error(`Cost of the item is higher than the ${item.skin} item`)

  const skillItems = await getSkillItems()
  const skillItemFound = skillItems.find((s) => s.skin === item.skin)
  let skillItem: SkillItemFileStorageConfig = {
    skin: item.skin,
    quantity: skillItemFound ? skillItemFound.quantity + 1 : 1,
  }

  const updatedSkillItems = [...skillItems.filter((s) => !(s.skin === item.skin)), skillItem]
  if (window.cordova) {
    await setInSecureKey(STORE_KEYS.SKILL_ITEMS, updatedSkillItems)
  } else {
    setFileStorageConfig({
      ...getGameProgressData(),
      skillItems: updatedSkillItems,
    })
  }

  await incPlayerGems(-item.itemCost)
}

export const getQuantityOfSkillItems = async (skin: SKILL_ITEM_SKINS): Promise<number> => {
  const skillItems = await getSkillItems()
  return skillItems.find((s) => s.skin === skin)?.quantity || 0
}

export const removeSkillItems = async (items: Array<SkillItemFileStorageConfig>) => {
  for (const item of items) {
    await removeSkillItem(item)
  }
}

export const getLevels = async (): Promise<Array<LevelFileStorageConfig>> => {
  if (window.cordova) {
    return await getFromSecureKey(STORE_KEYS.LEVELS, [])
  } else {
    return Promise.resolve(getGameProgressData().levels)
  }
}

export const getSkillItems = async (): Promise<Array<SkillItemFileStorageConfig>> => {
  if (window.cordova) {
    return await getFromSecureKey(STORE_KEYS.SKILL_ITEMS, [])
  } else {
    return Promise.resolve(getGameProgressData().skillItems)
  }
}

export const getGameProgressData = (): GameProgressData => {
  try {
    const value: any = localStorage.getItem(GAME_PROGRESS_STORAGE_KEY)
    let parsed = {}
    if (!!value) {
      parsed = JSON.parse(value)
    }
    return { ...INITIAL_GAME_PROGRESS_STORAGE, ...parsed }
  } catch (error) {
    return { ...INITIAL_GAME_PROGRESS_STORAGE }
  }
}

const removeSkillItem = async (item: SkillItemFileStorageConfig) => {
  const skillItems = await getSkillItems()
  let skillItemFound = skillItems.find((s) => s.skin === item.skin)
  if (!skillItemFound) {
    throw new Error(`Skill ${item.skin} item not found in the list ${skillItems}`)
  }
  skillItemFound.quantity -= item.quantity
  const updatedSkillItems = [...skillItems.filter((s) => !(s.skin === item.skin)), skillItemFound]
  if (window.cordova) {
    await setInSecureKey(STORE_KEYS.SKILL_ITEMS, updatedSkillItems)
  } else {
    setFileStorageConfig({
      ...getGameProgressData(),
      skillItems: updatedSkillItems,
    })
  }
}

const setFileStorageConfig = (fileStorage: GameProgressData) => {
  localStorage.setItem(GAME_PROGRESS_STORAGE_KEY, JSON.stringify(fileStorage))
}
