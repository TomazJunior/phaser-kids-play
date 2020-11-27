import { Item } from 'dynogels'

export default class UserService {
  logger: any

  constructor(logger: any) {
    this.logger = logger
  }

  async add(user: Item): Promise<any> {
    this.logger.debug('UserService.add', 'process started')
    return new Promise((resolve, reject) => {
      return user.save((err: Error, data: Item) => {
        if (err) {
          this.logger.debug('UserService.add', 'process failed')
          return reject(err)
        }
        resolve(data.toJSON())
        this.logger.debug('UserService.add', 'process completed')
      })
    })
  }
}
