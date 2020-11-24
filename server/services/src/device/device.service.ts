import { Item } from 'dynogels'
import { Device } from '../shared/models'

export default class DeviceService {
  logger: any

  constructor(logger: any) {
    this.logger = logger
  }

  async add(device: Item): Promise<Item> {
    this.logger.debug('DeviceService.add', 'process started')
    return new Promise((resolve, reject) => {
      return device.save((err: Error, data: Item) => {
        if (err) {
          this.logger.debug('DeviceService.add', 'process failed')
          return reject(err)
        }
        resolve(data.toJSON())
        this.logger.debug('DeviceService.add', 'process completed')
      })
    })
  }

  async update(id: number, properties: any) {
    this.logger.debug('DeviceService.update', 'process started')
    return new Promise((resolve, reject) => {
      return Device.update({ ...properties, id }, (err, data) => {
        if (err) {
          this.logger.debug('DeviceService.update', 'process failed')
          return reject(err)
        }
        resolve(data)
        this.logger.debug('DeviceService.update', 'process completed')
      })
    })
  }
}
