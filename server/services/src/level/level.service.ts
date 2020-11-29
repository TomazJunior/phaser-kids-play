import { Item } from 'dynogels'

export default class LevelService {
  logger: any

  constructor(logger: any) {
    this.logger = logger
  }

  async add(level: Item): Promise<any> {
    this.logger.debug('LevelService.add', 'process started')
    return new Promise((resolve, reject) => {
      return level.save((err: Error, data: Item) => {
        if (err) {
          this.logger.debug('LevelService.add', 'process failed')
          return reject(err)
        }
        resolve(data.toJSON())
        this.logger.debug('LevelService.add', 'process completed')
      })
    })
  }
}
