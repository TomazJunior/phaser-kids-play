import { Item } from 'dynogels'

export default class PurchaseService {
  logger: any

  constructor(logger: any) {
    this.logger = logger
  }

  async add(purchase: Item): Promise<any> {
    this.logger.debug('PurchaseService.add', 'process started')
    return new Promise((resolve, reject) => {
      return purchase.save((err: Error, data: Item) => {
        if (err) {
          this.logger.debug('PurchaseService.add', 'process failed')
          return reject(err)
        }
        resolve(data.toJSON())
        this.logger.debug('PurchaseService.add', 'process completed')
      })
    })
  }
}
