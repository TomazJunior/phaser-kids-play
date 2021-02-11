import GemAuditService from '../gemAudit/gemAudit.service'
import { GemAudit, GEM_AUDIT_TYPE, SkillItemAudit } from '../shared/models'
import Response from '../shared/response'
import UserService from '../user/user.service'
import SkillItemService from './skillItem.service'

export class SkillItemHandler {
  logger: any
  gemAuditService: GemAuditService
  skillItemService: SkillItemService
  userService: UserService
  constructor(logger) {
    this.logger = logger
    this.userService = new UserService(logger)
    this.skillItemService = new SkillItemService(logger)
    this.gemAuditService = new GemAuditService(logger)
  }

  purchase = async (req, res) => {
    req.log.debug('SkillItemHandler.purchase', 'Process started')
    const { userId } = req.params
    const { skin, quantity } = req.body
    if (!userId) return Promise.reject('userId property is required')
    if (!skin) return Promise.reject('skin property is required')
    if (!quantity) return Promise.reject('quantity property is required')

    const updatedData = await this.skillItemService.add(new SkillItemAudit({ ...req.body, userId }))
    await this.gemAuditService.add(
      new GemAudit({
        userId,
        recordType: GEM_AUDIT_TYPE.ITEM_PURCHASED,
        originId: updatedData.id,
        gems: updatedData.gems,
      })
    )
    
    const user = await this.userService.getOne(userId)
    user.gems -= updatedData.gems

    if (!user.skillItems) user.skillItems = []
    const skillItem = user.skillItems.find((item) => item.skin === skin)
    if (skillItem) {
      skillItem.quantity += quantity
    } else {
      user.skillItems.push({ quantity, skin })
    }

    await this.userService.update(userId, { gems: user.gems, skillItems: user.skillItems })

    res.json(new Response(updatedData))
    req.log.debug('SkillItemHandler.purchase', 'Process completed')
  }

  reward = async (req, res) => {
    req.log.debug('SkillItemHandler.reward', 'Process started')
    const { userId } = req.params
    const { skin, quantity } = req.body
    if (!userId) return Promise.reject('userId property is required')
    if (!skin) return Promise.reject('skin property is required')
    if (!quantity) return Promise.reject('quantity property is required')

    const updatedData = await this.skillItemService.add(new SkillItemAudit({ ...req.body, userId, gems: 0 }))
    
    const user = await this.userService.getOne(userId)
    
    if (!user.skillItems) user.skillItems = []
    const skillItem = user.skillItems.find((item) => item.skin === skin)
    if (skillItem) {
      skillItem.quantity += quantity
    } else {
      user.skillItems.push({ quantity, skin })
    }

    await this.userService.update(userId, { skillItems: user.skillItems })

    res.json(new Response(updatedData))
    req.log.debug('SkillItemHandler.reward', 'Process completed')
  }

  useItem = async (req, res) => {
    req.log.debug('SkillItemHandler.useItem', 'Process started')
    const { userId } = req.params
    const { skillItems, time } = req.body

    if (!skillItems) return Promise.reject('skillItems property is required')
    if (!time) return Promise.reject('time property is required')
    if (!userId) return Promise.reject('userId property is required')

    for (const item of skillItems) {
      await this.skillItemService.add(
        new SkillItemAudit({ skin: item.skin, userId, quantity: -item.quantity, gems: 0, time })
      )
    }

    const user = await this.userService.getOne(userId)
    if (!user.skillItems) user.skillItems = []
    skillItems.forEach(({ quantity, skin }) => {
      const skillItem = user.skillItems.find((item) => item.skin === skin)
      if (skillItem) {
        skillItem.quantity -= quantity
      } else {
        user.skillItems.push({ quantity, skin })
      }
    })
    
    await this.userService.update(userId, { skillItems: user.skillItems })
    res.json(
      new Response({
        status: 'ok',
      })
    )
    req.log.debug('SkillItemHandler.useItem', 'Process completed')
  }
}
