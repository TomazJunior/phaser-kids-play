import { ServiceApi } from '../utils/api'
import { getDeviceInformation } from '../utils/deviceData'
import { getFileStorageConfig } from '../utils/gameInfoData'

export const updateUserInfo = async () => {
  const { userId, deviceId } = getFileStorageConfig()
  const api = new ServiceApi()
  if (!deviceId || !userId) {
    const { serial, uuid, version, platform } = getDeviceInformation()
    await api.createUser({ serial, uuid, version, platform })
  } else {
    await api.deviceStarted(userId, deviceId)
  }
}
