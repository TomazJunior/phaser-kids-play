const FILE_STORAGE_KEY = 'fileStorage'
const initialFileStorageConfig: FileStorageConfig = {
  tutorials: [],
  sound: true,
  backgroudSound: true,
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

export const getFileStorageConfig = (): FileStorageConfig => {
  try {
    const value: any = localStorage.getItem(FILE_STORAGE_KEY)
    let parsed = {}
    if (!!value) {
      parsed = JSON.parse(value)
    }
    return { ...initialFileStorageConfig, ...parsed }
  } catch (error) {
    return { ...initialFileStorageConfig }
  }
}

export const clearTutorial = (): void => {
  setFileStorageConfig({
    ...getFileStorageConfig(),
    tutorials: [],
  })
}

export const getTutorialSeen = (gameWorld: GameWorld, level: number): boolean => {
  const { tutorials } = getFileStorageConfig()
  const tutorial = tutorials.find((tutorial) => tutorial.level === level && gameWorld.key == tutorial.key)
  if (!tutorial) return false
  return tutorial.seen
}

export const setTutorialSeen = (key: string, level: number, seen: boolean) => {
  const { tutorials } = getFileStorageConfig()
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
    ...getFileStorageConfig(),
    tutorials: [
      ...tutorials.filter((item) => {
        const found = item.level === tutorial?.level && item.key === tutorial?.key
        return !found
      }),
      tutorial,
    ],
  })
}

export const incPlayerGems = (value: number): void => {
  const newValue = getGems() + value
  if (newValue < 0) throw new Error('Gems became negative, something wrong happened')
  setFileStorageConfig({
    ...getFileStorageConfig(),
    gems: newValue,
  })
}

export const getGems = (): number => {
  return getFileStorageConfig().gems
}

export const setSoundEnabled = (isSoundEnabled: boolean) => {
  setFileStorageConfig({
    ...getFileStorageConfig(),
    sound: isSoundEnabled,
  })
}

export const isSoundEnabled = (): boolean => {
  return getFileStorageConfig().sound
}

export const setBackgroundSoundEnabled = (value: boolean) => {
  setFileStorageConfig({
    ...getFileStorageConfig(),
    backgroudSound: value,
  })
}

export const isBackgroundSoundEnabled = (): boolean => {
  return getFileStorageConfig().backgroudSound
}

export const getLevelStorage = (level: number, key: string): LevelFileStorageConfig | undefined => {
  const { levels } = getFileStorageConfig()
  const levelFound = levels.find((item) => item.level === level && item.key === key)
  return levelFound ? { ...levelFound } : undefined
}

export const setLevelStorage = (data: LevelFileStorageConfig) => {
  const { levels } = getFileStorageConfig()
  const currentLevel = levels.find((item) => item.level === data.level && item.key === data.key)
  const maxStars = Math.max(data.stars, currentLevel?.stars || 0)
  const level: LevelFileStorageConfig = { ...data, attempts: (currentLevel?.attempts || 0) + 1, stars: maxStars }

  setFileStorageConfig({
    ...getFileStorageConfig(),
    levels: [...levels.filter((item) => !(item.key === level.key && item.level === level.level)), level],
  })
}

const setFileStorageConfig = (fileStorage: FileStorageConfig) => {
  localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(fileStorage))
}

export const buySkillItem = (item: SkillItemDefinition) => {
  const gems = getGems()
  if (item.itemCost > gems) throw new Error(`Cost of the item is higher than the ${item.skin} item`)

  const { skillItems } = getFileStorageConfig()
  const skillItemFound = skillItems.find((s) => s.skin === item.skin)
  let skillItem: SkillItemFileStorageConfig = {
    skin: item.skin,
    quantity: skillItemFound ? skillItemFound.quantity + 1 : 1,
  }

  setFileStorageConfig({
    ...getFileStorageConfig(),
    skillItems: [...skillItems.filter((s) => !(s.skin === item.skin)), skillItem],
  })
  incPlayerGems(-item.itemCost)
}
