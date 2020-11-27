const GAME_INFO_STORAGE_KEY = 'gameConfigInfo'

const initialFileStorageConfig: GameConfigInfoData = {
  tutorials: [],
  userId: '',
  deviceId: '',
  sound: true,
  backgroudSound: true,
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

export const setDeviceId = (deviceId: string) => {
  setFileStorageConfig({
    ...getFileStorageConfig(),
    deviceId,
  })
}

export const setUserId = (userId: string) => {
  setFileStorageConfig({
    ...getFileStorageConfig(),
    userId,
  })
}

export const getDeviceId = (): string => {
  return getFileStorageConfig().deviceId
}

export const getUserId = (): string => {
  return getFileStorageConfig().userId
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

export const getFileStorageConfig = (): GameConfigInfoData => {
  try {
    const value: any = localStorage.getItem(GAME_INFO_STORAGE_KEY)
    let parsed = {}
    if (!!value) {
      parsed = JSON.parse(value)
    }
    return { ...initialFileStorageConfig, ...parsed }
  } catch (error) {
    return { ...initialFileStorageConfig }
  }
}

const setFileStorageConfig = (fileStorage: GameConfigInfoData) => {
  localStorage.setItem(GAME_INFO_STORAGE_KEY, JSON.stringify(fileStorage))
}
