import DeviceService from '../device/device.service'
import { Device, User } from '../shared/models'
import Response from '../shared/response'
import UserService from './user.service'

export class UserHandler {
  logger: any
  userService: UserService
  deviceService: DeviceService
  constructor(logger) {
    this.logger = logger
    this.userService = new UserService(logger)
    this.deviceService = new DeviceService(logger)
  }

  create = async (req, res) => {
    req.log.debug('UserHandler.create', 'Process started')
    const user = new User({
      active: true
    })
    const userDB = await this.userService.add(user)
    const device = new Device({ ...req.body, userId: userDB.id })
    const deviceDB = await this.deviceService.add(device)
    res.json(new Response({ userId: userDB.id, deviceId: deviceDB.id }))
    req.log.debug('UserHandler.create', 'Process completed')
  }
}
