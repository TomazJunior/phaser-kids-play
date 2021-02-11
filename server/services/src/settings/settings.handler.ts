import Response from '../shared/response'
import SettingsService from './settings.service'

export class SettingsHandler {
  logger: any
  settingsService: SettingsService
  constructor(logger) {
    this.logger = logger
    this.settingsService = new SettingsService(logger)
  }

  get = async (req, res) => {
    req.log.debug('SettingsHandler.get', 'Process started')
    const { key } = req.params
    const data = await this.settingsService.getOne(key)
    res.json(new Response(data))
    req.log.debug('SettingsHandler.get', 'Process completed')
  }
}
