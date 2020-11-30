import { Item } from 'dynogels'
import { User } from '../shared/models'

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

  async getOne(id: string): Promise<any> {
    this.logger.debug('UserService.getOne', 'process started')
    return new Promise((resolve, reject) => {
      return User.get(id, (err: Error, data: Item) => {
        if (err) {
          this.logger.debug('UserService.getOne', 'process failed')
          return reject(err)
        }
        resolve(data && data.toJSON())
        this.logger.debug('UserService.getOne', 'process completed')
      })
    })
  }

  async update(id: string, properties: any) {
    this.logger.debug('UserService.update', 'process started')
    return new Promise((resolve, reject) => {
      return User.update({ ...properties, id }, (err: Error, data: Item) => {
        if (err) {
          this.logger.debug('UserService.update', 'process failed')
          return reject(err)
        }
        resolve(data && data.toJSON())
        this.logger.debug('UserService.update', 'process completed')
      })
    })
  }
}
