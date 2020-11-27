import { ServiceApi } from '../utils/api'
import { getDeviceInformation } from '../utils/deviceData'
import { getFileStorageConfig, setDeviceId, setUserId } from '../utils/gameInfoData'

export const updateUserInfo = async () => {
  const { userId, deviceId } = getFileStorageConfig()
  const api = new ServiceApi()
  if (!deviceId || !userId) {
    const { serial, uuid, version, platform } = getDeviceInformation()
    const { data }: any = await api.createUser({ serial, uuid, version, platform })
    setUserId(data.userId)
    setDeviceId(data.deviceId)
  } else {
    await api.deviceStarted(userId, deviceId)
  }
}
