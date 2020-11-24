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

  create = async (req, res) => {
    req.log.debug('DeviceHandler.create', 'Process started')
    const device = await this.deviceService.add(new Device({ ...req.body }))
    res.json(new Response(device))
    req.log.debug('DeviceHandler.create', 'Process completed')
  }

  updateLastTimeAccessed = async (req, res) => {
    req.log.debug('DeviceHandler.updateLastTimeAccessed', 'Process started')
    const { id } = req.params
    await this.deviceService.update(id, {})

    res.json(
      new Response({
        status: 'ok',
      })
    )
    req.log.debug('DeviceHandler.updateLastTimeAccessed', 'Process completed')
  }
}
