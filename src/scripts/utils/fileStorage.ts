const FILE_STORAGE_KEY = 'fileStorage'
const initialFileStorageConfig: FileStorageConfig = {
  tutorialMode: true,
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

export const setTutorialMode = (istutorialMode: boolean) => {
  setFileStorageConfig({
    ...getFileStorageConfig(),
    tutorialMode: istutorialMode,
  })
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
