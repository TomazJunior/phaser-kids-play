import { Item } from 'dynogels'

export default class MiniGameService {
  logger: any

  constructor(logger: any) {
    this.logger = logger
  }

  async add(miniGame: Item): Promise<any> {
    this.logger.debug('MiniGameService.add', 'process started')
    return new Promise((resolve, reject) => {
      return miniGame.save((err: Error, data: Item) => {
        if (err) {
          this.logger.debug('MiniGameService.add', 'process failed')
          return reject(err)
        }
        resolve(data.toJSON())
        this.logger.debug('MiniGameService.add', 'process completed')
      })
    })
  }
}
