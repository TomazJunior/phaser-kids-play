import GemAuditService from '../gemAudit/gemAudit.service'
import DeviceService from '../device/device.service'
import { Device, User } from '../shared/models'
import Response from '../shared/response'
import UserService from './user.service'
import { GemAudit, GEM_AUDIT_TYPE, Level } from '../shared/models'

export class UserHandler {
  logger: any
  userService: UserService
  deviceService: DeviceService
  gemAuditService: GemAuditService
  constructor(logger) {
    this.logger = logger
    this.userService = new UserService(logger)
    this.deviceService = new DeviceService(logger)
    this.gemAuditService = new GemAuditService(logger)
  }

  getOne = async (req, res) => {
    req.log.debug('UserHandler.getOne', 'Process started')
    const { userId } = req.params
    const user = await this.userService.getOne(userId)
    const { id, gems } = user
    res.json(new Response({ userId: id, gems }))
    req.log.debug('UserHandler.getOne', 'Process completed')
  }

  create = async (req, res) => {
    req.log.debug('UserHandler.create', 'Process started')
    const user = new User({
      active: true,
    })
    const userDB = await this.userService.add(user)
    const device = new Device({ ...req.body, userId: userDB.id })
    const deviceDB = await this.deviceService.add(device)
    res.json(new Response({ userId: userDB.id, deviceId: deviceDB.id }))
    req.log.debug('UserHandler.create', 'Process completed')
  }

  buyGemsViaAds = async (req: any, res: any) => {
    req.log.debug('UserHandler.buyGems', 'Process started')
    const { userId, gems } = req.params
    const user = await this.userService.getOne(userId)

    // no need to update if there is no gem to be updated
    if (parseInt(gems) > 0) {
      user.gems += parseInt(gems)
      await this.userService.update(userId, { gems: user.gems })

      await this.gemAuditService.add(
        new GemAudit({
          userId,
          recordType: GEM_AUDIT_TYPE.GEMS_ADS,
          originId: userId,
          gems: gems,
        })
      )
    }

    res.json(
      new Response({
        status: 'ok',
      })
    )
    req.log.debug('UserHandler.buyGems', 'Process completed')
  }


  buyBlueGemsViaAds = async (req: any, res: any) => {
    req.log.debug('UserHandler.buyBlueGemsViaAds', 'Process started')
    const { userId, gems } = req.params
    const user = await this.userService.getOne(userId)

    // no need to update if there is no gem to be updated
    if (parseInt(gems) > 0) {
      user.blueGems += parseInt(gems)
      await this.userService.update(userId, { blueGems: user.blueGems })

      await this.gemAuditService.add(
        new GemAudit({
          userId,
          recordType: GEM_AUDIT_TYPE.BLUE_GEMS_ADS,
          originId: userId,
          gems: gems,
        })
      )
    }

    res.json(
      new Response({
        status: 'ok',
      })
    )
    req.log.debug('UserHandler.buyBlueGemsViaAds', 'Process completed')
  }
}
