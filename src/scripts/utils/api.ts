import { AxiosInstance } from 'axios'
import urlJoin from 'url-join'
import NotConnectedError from '../errors/notConnectError'
import { AxiosHelper } from './axiosHelper'
import { isOnline } from './deviceData'
import { isLocalhost } from './deviceUtils'
import { setDeviceId, setUserId } from './gameInfoData'

export class ServiceApi {
  api: AxiosInstance
  constructor() {
    const baseURL = isLocalhost()
      ? 'http://localhost:5000'
      : 'https://i26pozpz1g.execute-api.us-east-1.amazonaws.com/dev'
    this.api = new AxiosHelper({ baseURL }).api
  }

  getUser = async (userId: string): Promise<{id: string, gems: number}> => {
    if (!userId) return Promise.reject('user id is required')
    if (!isOnline()) return Promise.reject(new NotConnectedError())
    const { data }: any = await this.api.get(urlJoin(this.api.defaults.baseURL, `/user/${userId}`))
    return Promise.resolve(data)
  }

  createUser = async (deviceInfo: any) => {
    if (!isOnline()) return Promise.resolve()
    const { data }: any = await this.api.post(urlJoin(this.api.defaults.baseURL, `/user`), {
      ...deviceInfo,
    })

    setUserId(data.userId)
    setDeviceId(data.deviceId)
  }

  deviceStarted = async (userId: string, deviceId: string) => {
    if (!isOnline()) return Promise.resolve()
    return await this.api.put(urlJoin(this.api.defaults.baseURL, `/user/${userId}/device/${deviceId}/started`))
  }

  levelCompleted = async (userId: string, level: LevelCompleted) => {
    if (!isOnline()) return Promise.reject(new NotConnectedError())
    return await this.api.post(urlJoin(this.api.defaults.baseURL, `/user/${userId}/level`), {
      userId,
      worldId: level.key,
      level: level.level,
      rounds: level.rounds,
      gems: level.gems,
      stars: level.stars,
      time: level.time,
    })
  }

  skillItemPurchased = async (userId: string, skillItemPurchased: SkillItemPurchased) => {
    if (!isOnline()) return Promise.reject(new NotConnectedError())
    return await this.api.post(urlJoin(this.api.defaults.baseURL, `/user/${userId}/skill-item/purchase`), {
      userId,
      ...skillItemPurchased,
    })
  }

  skillItemUsed = async (userId: string, skillItems: Array<SkillItemFileStorageConfig>, time: string) => {
    if (!isOnline()) return Promise.reject(new NotConnectedError())
    return await this.api.post(urlJoin(this.api.defaults.baseURL, `/user/${userId}/skill-item/use`), {
      skillItems,
      time,
    })
  }
}
