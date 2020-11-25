import { ServiceApi } from '../utils/api'
import { getDeviceId, getDeviceInformation, setDeviceId } from '../utils/fileStorage'

export const updateDeviceInfo = async () => {
  const deviceId: string = getDeviceId()
  const api = new ServiceApi()
  if (!deviceId) {
    const { serial, uuid, version, platform } = getDeviceInformation()
    const { data }: any = await api.createDevice({ serial, uuid, version, platform })
    setDeviceId(data.id)
  } else {
    await api.deviceStarted(deviceId)
  }
}
