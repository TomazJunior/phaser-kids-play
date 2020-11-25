import axios, { AxiosInstance } from 'axios'
import { isValidJson } from './jsonUtil'

export class AxiosHelper {
  api: AxiosInstance
  constructor({ baseURL }) {
    this.api = axios.create({
      baseURL,
      transformResponse: [
        (response) => {
          if (isValidJson(response)) {
            return JSON.parse(response).data
          }
          return response
        },
      ],
    })
    this.api.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        // Do something with response error
        console.error(error)
        return Promise.reject(error)
      }
    )
  }
}
