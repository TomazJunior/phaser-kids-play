import { DeviceHandler } from './device.handler'

export const initialize = (router) => {
  router.put('user/:userId/device/:deviceId/started', async (req, res) => {
    const deviceHandler = new DeviceHandler(req.log)
    return deviceHandler.updateLastTimeAccessed(req, res)
  })
}
