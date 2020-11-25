import { DeviceHandler } from './device.handler'

export const initialize = (router) => {
  router.post('device', async (req, res) => {
    const deviceHandler = new DeviceHandler(req.log)
    return deviceHandler.create(req, res)
  })
  router.put('device/:id/started', async (req, res) => {
    const deviceHandler = new DeviceHandler(req.log)
    return deviceHandler.updateLastTimeAccessed(req, res)
  })
}
