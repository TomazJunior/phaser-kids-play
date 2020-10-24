const FILE_STORAGE_KEY = 'fileStorage'
const initialFileStorageConfig: FileStorageConfig = {
  tutorials: [
    {
      level: 1,
      seen: false,
    },
    {
      level: 2,
      seen: false,
    },
  ],
  sound: true,
  levels: [
    {
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

export const getTutorialSeen = (level: number): boolean => {
  const { tutorials } = getFileStorageConfig()
  const tutorial = tutorials.find((tutorial) => tutorial.level === level)
  if (!tutorial) return true
  return tutorial.seen
}

export const setTutorialSeen = (level: number, seen: boolean) => {
  const { tutorials } = getFileStorageConfig()
  const tutorial = tutorials.find((tutorial) => tutorial.level === level)
  if (!tutorial) return
  tutorial.seen = seen

  setFileStorageConfig({
    ...getFileStorageConfig(),
    tutorials: [...tutorials.filter((item) => item.level !== tutorial.level), tutorial],
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

export const setLevel = (level: LevelFileStorageConfig) => {
  const { levels } = getFileStorageConfig()
  const currentLevel = levels.find((item) => item.level === level.level)
  if (!currentLevel || level.stars > currentLevel.stars) {
    setFileStorageConfig({
      ...getFileStorageConfig(),
      levels: [...levels.filter((item) => item.level !== level.level), level],
    })
  }
}

const setFileStorageConfig = (fileStorage: FileStorageConfig) => {
  localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(fileStorage))
}
