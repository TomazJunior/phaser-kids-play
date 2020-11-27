import { Device } from '../shared/models'
import Response from '../shared/response'
import DeviceService from './device.service'

export class DeviceHandler {
  logger: any
  deviceService: DeviceService
  constructor(logger) {
    this.logger = logger
    this.deviceService = new DeviceService(logger)
  }

  updateLastTimeAccessed = async (req, res) => {
    req.log.debug('DeviceHandler.updateLastTimeAccessed', 'Process started')
    const { userId, deviceId } = req.params
    const updatedData = await this.deviceService.update(userId, deviceId, {})
    res.json(new Response(updatedData))
    req.log.debug('DeviceHandler.updateLastTimeAccessed', 'Process completed')
  }
}
