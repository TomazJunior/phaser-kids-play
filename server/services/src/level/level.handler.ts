import GemAuditService from '../gemAudit/gemAudit.service'
import { GemAudit, GEM_AUDIT_TYPE, Level } from '../shared/models'
import Response from '../shared/response'
import LevelService from './level.service'

export class LevelHandler {
  logger: any
  levelService: LevelService
  gemAuditService: GemAuditService
  constructor(logger) {
    this.logger = logger
    this.levelService = new LevelService(logger)
    this.gemAuditService = new GemAuditService(logger)
  }

  addLevel = async (req, res) => {
    req.log.debug('LevelHandler.addLevel', 'Process started')
    const { userId } = req.params
    const updatedData = await this.levelService.add(new Level({ ...req.body, userId }))
    await this.gemAuditService.add(
      new GemAudit({ userId, recordType: GEM_AUDIT_TYPE.LEVEL_COMPLETED, originId: updatedData.id, quantity: updatedData.gems })
    )
    res.json(new Response(updatedData))
    req.log.debug('LevelHandler.addLevel', 'Process completed')
  }
}
