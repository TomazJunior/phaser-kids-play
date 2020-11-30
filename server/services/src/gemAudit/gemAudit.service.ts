import { Item } from 'dynogels'

export default class GemAuditService {
  logger: any

  constructor(logger: any) {
    this.logger = logger
  }

  async add(gemAudit: Item): Promise<any> {
    this.logger.debug('GemAuditService.add', 'process started')
    return new Promise((resolve, reject) => {
      return gemAudit.save((err: Error, data: Item) => {
        if (err) {
          this.logger.debug('GemAuditService.add', 'process failed')
          return reject(err)
        }
        resolve(data.toJSON())
        this.logger.debug('GemAuditService.add', 'process completed')
      })
    })
  }
}
