import GemAuditService from '../gemAudit/gemAudit.service'
import { GemAudit, GEM_AUDIT_TYPE, Purchase } from '../shared/models'
import Response from '../shared/response'
import UserService from '../user/user.service'
import PurchaseService from './purchase.service'

export class PurchaseHandler {
  logger: any
  purchaseService: PurchaseService
  gemAuditService: GemAuditService
  userService: UserService
  constructor(logger) {
    this.logger = logger
    this.userService = new UserService(logger)
    this.purchaseService = new PurchaseService(logger)
    this.gemAuditService = new GemAuditService(logger)
  }

  addPurchase = async (req, res) => {
    req.log.debug('PurchaseHandler.addPurchase', 'Process started')
    const { userId } = req.params
    const { gems, transactionID, receipt } = req.body

    // no need to update if there is no gem to be updated
    if (gems > 0) {
      const updatedData = await this.purchaseService.add(new Purchase({ gems, transactionID, receipt, userId }))
      await this.gemAuditService.add(
        new GemAudit({
          userId,
          recordType: GEM_AUDIT_TYPE.GEMS_BOUGHT,
          originId: updatedData.id,
          gems: updatedData.gems,
        })
      )
    }

    const user = await this.userService.getOne(userId)
    user.gems += gems

    await this.userService.update(userId, { gems: user.gems })

    res.json(
      new Response({
        status: 'ok',
      })
    )
    req.log.debug('PurchaseHandler.addPurchase', 'Process completed')
  }
}
