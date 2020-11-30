import GemAuditService from '../gemAudit/gemAudit.service'
import { GemAudit, GEM_AUDIT_TYPE, SkillItemAudit } from '../shared/models'
import Response from '../shared/response'
import SkillItemService from './skillItem.service'

export class SkillItemHandler {
  logger: any
  gemAuditService: GemAuditService
  skillItemService: SkillItemService
  constructor(logger) {
    this.logger = logger
    this.skillItemService = new SkillItemService(logger)
    this.gemAuditService = new GemAuditService(logger)
  }

  purchase = async (req, res) => {
    req.log.debug('SkillItemHandler.purchase', 'Process started')
    const { userId } = req.params

    const updatedData = await this.skillItemService.add(new SkillItemAudit({ ...req.body, userId }))
    await this.gemAuditService.add(
      new GemAudit({
        userId,
        recordType: GEM_AUDIT_TYPE.ITEM_PURCHASED,
        originId: updatedData.id,
        gems: updatedData.gems,
      })
    )
    res.json(new Response(updatedData))
    req.log.debug('SkillItemHandler.purchase', 'Process completed')
  }

  useItem = async (req, res) => {
    req.log.debug('SkillItemHandler.useItem', 'Process started')
    const { userId } = req.params
    const { skillItems, time } = req.body

    for (const item of skillItems) {
      await this.skillItemService.add(
        new SkillItemAudit({ skillItem: item.skin, userId, quantity: -item.quantity, gems: 0, time })
      )
    }
    res.json(
      new Response({
        status: 'ok',
      })
    )
    req.log.debug('SkillItemHandler.useItem', 'Process completed')
  }
}
