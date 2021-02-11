import { Item } from 'dynogels'
import { Settings } from '../shared/models'

export default class SettingsService {
  logger: any

  constructor(logger: any) {
    this.logger = logger
  }

  async getOne(key: string): Promise<any> {
    this.logger.debug('SettingsService.getOne', 'process started')
    return new Promise((resolve, reject) => {
      return Settings.get(key, (err: Error, data: Item) => {
        if (err) {
          this.logger.debug('SettingsService.getOne', 'process failed')
          return reject(err)
        }
        resolve(data && data.toJSON())
        this.logger.debug('SettingsService.getOne', 'process completed')
      })
    })
  }
}
