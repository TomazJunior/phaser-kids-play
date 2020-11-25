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

  createDevice = async (data: any) =>
    await this.api.post(urlJoin(this.api.defaults.baseURL, `/device`), {
      ...data,
    })
  deviceStarted = async (deviceId: string) =>
    await this.api.put(urlJoin(this.api.defaults.baseURL, `/device/${deviceId}/started`))
}
