import { Level } from '../shared/models'
import Response from '../shared/response'
import LevelService from './level.service'

export class LevelHandler {
  logger: any
  levelService: LevelService
  constructor(logger) {
    this.logger = logger
    this.levelService = new LevelService(logger)
  }

  addLevel = async (req, res) => {
    req.log.debug('LevelHandler.addLevel', 'Process started')
    const { userId } = req.params
    const updatedData = await this.levelService.add(new Level({...req.body, userId}))
    res.json(new Response(updatedData))
    req.log.debug('LevelHandler.addLevel', 'Process completed')
  }
}
