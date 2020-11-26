import { STORE_KEYS } from './constants'
import { getFromSecureKey, setInSecureKey } from './secureKeyStore'
import { SKILL_ITEM_SKINS } from './skillItems'

const GAME_PROGRESS_STORAGE_KEY = 'gamePogressInfo'

const INITIAL_GAME_PROGRESS_STORAGE: GameProgressData = {
  tutorials: [],
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

export const getTutorialSeen = (gameWorld: GameWorld, level: number): boolean => {
  const { tutorials } = getGameProgressData()
  const tutorial = tutorials.find((tutorial) => tutorial.level === level && gameWorld.key == tutorial.key)
  if (!tutorial) return false
  return tutorial.seen
}

export const setTutorialSeen = (key: string, level: number, seen: boolean) => {
  const { tutorials } = getGameProgressData()
  let tutorial = tutorials.find((tutorial) => tutorial.level === level && tutorial.key === key)
  if (!tutorial) {
    tutorial = {
      key,
      level,
      seen,
    }
  }
  tutorial.seen = seen

  setFileStorageConfig({
    ...getGameProgressData(),
    tutorials: [
      ...tutorials.filter((item) => {
        const found = item.level === tutorial?.level && item.key === tutorial?.key
        return !found
      }),
      tutorial,
    ],
  })
}

export const incPlayerGems = async (value: number): Promise<void> => {
  const newValue = (await getGems()) + value
  if (newValue < 0) throw new Error('Gems became negative, something wrong happened')
  if (window.cordova) {
    await setInSecureKey(STORE_KEYS.GEMS, newValue)
  }
  setFileStorageConfig({
    ...getGameProgressData(),
    gems: newValue,
  })
}

export const getGems = async (): Promise<number> => {
  if (window.cordova) {
    return await getFromSecureKey(STORE_KEYS.GEMS, 0)
  } else {
    return Promise.resolve(getGameProgressData().gems)
  }
}

export const getLevelStorage = (level: number, key: string): LevelFileStorageConfig | undefined => {
  const { levels } = getGameProgressData()
  const levelFound = levels.find((item) => item.level === level && item.key === key)
  return levelFound ? { ...levelFound } : undefined
}

export const setLevelStorage = (data: LevelFileStorageConfig) => {
  const { levels } = getGameProgressData()
  const currentLevel = levels.find((item) => item.level === data.level && item.key === data.key)
  const maxStars = Math.max(data.stars, currentLevel?.stars || 0)
  const level: LevelFileStorageConfig = { ...data, attempts: (currentLevel?.attempts || 0) + 1, stars: maxStars }

  setFileStorageConfig({
    ...getGameProgressData(),
    levels: [...levels.filter((item) => !(item.key === level.key && item.level === level.level)), level],
  })
}

export const buySkillItem = async (item: SkillItemDefinition) => {
  const gems = await getGems()
  if (item.itemCost > gems) throw new Error(`Cost of the item is higher than the ${item.skin} item`)

  const { skillItems } = getGameProgressData()
  const skillItemFound = skillItems.find((s) => s.skin === item.skin)
  let skillItem: SkillItemFileStorageConfig = {
    skin: item.skin,
    quantity: skillItemFound ? skillItemFound.quantity + 1 : 1,
  }

  setFileStorageConfig({
    ...getGameProgressData(),
    skillItems: [...skillItems.filter((s) => !(s.skin === item.skin)), skillItem],
  })
  await incPlayerGems(-item.itemCost)
}

export const getQuantityOfSkillItems = (skin: SKILL_ITEM_SKINS): number => {
  const { skillItems } = getGameProgressData()
  return skillItems.find((s) => s.skin === skin)?.quantity || 0
}

export const removeSkillItems = (items: Array<SkillItemFileStorageConfig>) => {
  items.forEach((item) => removeSkillItem(item))
}

export const getLevels = (): Array<LevelFileStorageConfig> => {
  const { levels } = getGameProgressData()
  return levels
}

export const getSkillItems = (): Array<SkillItemFileStorageConfig> => {
  const { skillItems } = getGameProgressData()
  return skillItems
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

const removeSkillItem = (item: SkillItemFileStorageConfig) => {
  const { skillItems } = getGameProgressData()
  let skillItemFound = skillItems.find((s) => s.skin === item.skin)
  if (!skillItemFound) {
    throw new Error(`Skill ${item.skin} item not found in the list ${skillItems}`)
  }
  skillItemFound.quantity -= item.quantity
  setFileStorageConfig({
    ...getGameProgressData(),
    skillItems: [...skillItems.filter((s) => !(s.skin === item.skin)), skillItemFound],
  })
}

const setFileStorageConfig = (fileStorage: GameProgressData) => {
  localStorage.setItem(GAME_PROGRESS_STORAGE_KEY, JSON.stringify(fileStorage))
}
