const DEVICE_FILE_STORAGE_KEY = 'deviceinfo'

const initialDeviceStorageConfig: DeviceStorageConfig = {
  isOnline: false,
}

export const isOnline = (): boolean => {
  const { isOnline } = getDeviceInformation()
  if (!isOnline) {
    console.warn('device is not connected')
  }
  return isOnline
}

export const setIsOnline = (isOnline: boolean) => {
  setDeviceInformation({
    ...getDeviceInformation(),
    isOnline,
  })
}

export const setDeviceInfoConfig = (deviceInfo: DeviceInfoConfig) => {
  setDeviceInformation({
    ...getDeviceInformation(),
    ...deviceInfo,
  })
}

export const getDeviceInformation = (): DeviceStorageConfig => {
  try {
    const value: any = localStorage.getItem(DEVICE_FILE_STORAGE_KEY)
    let parsed = {}
    if (!!value) {
      parsed = JSON.parse(value)
    }
    return { ...initialDeviceStorageConfig, ...parsed }
  } catch (error) {
    return { ...initialDeviceStorageConfig }
  }
}

const setDeviceInformation = (data: DeviceStorageConfig) => {
  if (!data) {
    data = { isOnline: true }
  }
  localStorage.setItem(DEVICE_FILE_STORAGE_KEY, JSON.stringify(data))
}
