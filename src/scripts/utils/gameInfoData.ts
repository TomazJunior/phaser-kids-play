const GAME_INFO_STORAGE_KEY = 'gameConfigInfo'

const initialFileStorageConfig: GameConfigInfoData = {
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
    deviceId: deviceId,
  })
}

export const getDeviceId = (): string => {
  return getFileStorageConfig().deviceId
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
