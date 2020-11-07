const FILE_STORAGE_KEY = 'fileStorage'
const initialFileStorageConfig: FileStorageConfig = {
  tutorials: [],
  sound: true,
  backgroudSound: true,
  levels: [
    {
      key: '1',
      level: 1,
      stars: 0,
    },
  ],
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

export const setLevel = (level: LevelFileStorageConfig) => {
  const { levels } = getFileStorageConfig()
  const currentLevel = levels.find((item) => item.level === level.level && item.key === level.key)
  if (!currentLevel || level.stars > currentLevel.stars) {
    setFileStorageConfig({
      ...getFileStorageConfig(),
      levels: [...levels.filter((item) => !(item.key === level.key && item.level === level.level)), level],
    })
  }
}

const setFileStorageConfig = (fileStorage: FileStorageConfig) => {
  localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(fileStorage))
}