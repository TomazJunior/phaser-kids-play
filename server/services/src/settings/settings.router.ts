import { SettingsHandler } from './settings.handler'

export const initialize = (router) => {
  router.get('settings/:key', async (req, res) => {
    const settingsHandler = new SettingsHandler(req.log)
    return settingsHandler.get(req, res)
  })
}
