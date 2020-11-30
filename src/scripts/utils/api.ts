import { AxiosInstance } from 'axios'
import urlJoin from 'url-join'
import { AxiosHelper } from './axiosHelper'
import { isLocalhost } from './deviceUtils'

export class ServiceApi {
  api: AxiosInstance
  constructor() {
    const baseURL = isLocalhost()
      ? 'http://localhost:5000'
      : 'https://i26pozpz1g.execute-api.us-east-1.amazonaws.com/dev'
    this.api = new AxiosHelper({ baseURL }).api
  }

  createUser = async (data: any) =>
    await this.api.post(urlJoin(this.api.defaults.baseURL, `/user`), {
      ...data,
    })
  deviceStarted = async (userId: string, deviceId: string) =>
    await this.api.put(urlJoin(this.api.defaults.baseURL, `/user/${userId}/device/${deviceId}/started`))

  levelCompleted = async (userId: string, level: LevelCompleted) =>
    await this.api.post(urlJoin(this.api.defaults.baseURL, `/user/${userId}/level`), {
      userId,
      worldId: level.key,
      level: level.level,
      rounds: level.rounds,
      gems: level.gems,
      stars: level.stars,
      time: level.time,
    })

  skillItemPurchased = async (userId: string, skillItemPurchased: SkillItemPurchased) =>
    await this.api.post(urlJoin(this.api.defaults.baseURL, `/user/${userId}/skill-item/purchase`), {
      userId,
      ...skillItemPurchased,
    })

  skillItemUsed = async (userId: string, skillItems: Array<SkillItemFileStorageConfig>, time: string) =>
    await this.api.post(urlJoin(this.api.defaults.baseURL, `/user/${userId}/skill-item/use`), {
      skillItems,
      time,
    })
}
