import { Item } from 'dynogels'

export default class SkillItemService {
  logger: any

  constructor(logger: any) {
    this.logger = logger
  }

  async add(skillItem: Item): Promise<any> {
    this.logger.debug('SkillItemService.add', 'process started')
    return new Promise((resolve, reject) => {
      return skillItem.save((err: Error, data: Item) => {
        if (err) {
          this.logger.debug('SkillItemService.add', 'process failed')
          return reject(err)
        }
        resolve(data.toJSON())
        this.logger.debug('SkillItemService.add', 'process completed')
      })
    })
  }
}
