import GemAuditService from '../gemAudit/gemAudit.service'
import { GemAudit, GEM_AUDIT_TYPE, Level } from '../shared/models'
import Response from '../shared/response'
import UserService from '../user/user.service'
import LevelService from './level.service'

export class LevelHandler {
  logger: any
  levelService: LevelService
  gemAuditService: GemAuditService
  userService: UserService
  constructor(logger) {
    this.logger = logger
    this.userService = new UserService(logger)
    this.levelService = new LevelService(logger)
    this.gemAuditService = new GemAuditService(logger)
  }

  addLevel = async (req, res) => {
    req.log.debug('LevelHandler.addLevel', 'Process started')
    const { userId } = req.params
    const { gems, stars, worldId, level } = req.body

    // no need to update if there is no gem to be updated
    if (gems > 0) {
      const updatedData = await this.levelService.add(new Level({ ...req.body, userId }))
      await this.gemAuditService.add(
        new GemAudit({
          userId,
          recordType: GEM_AUDIT_TYPE.LEVEL_COMPLETED,
          originId: updatedData.id,
          gems: updatedData.gems,
        })
      )
    }

    const user = await this.userService.getOne(userId)
    user.gems += gems

    if (!user.levels) user.levels = []
    const levelData = user.levels.find((item) => item.worldId === worldId && item.level === level)
    if (levelData) {
      levelData.stars = Math.max(levelData.stars, stars)
      levelData.attempts++
    } else {
      user.levels.push({
        worldId,
        level,
        stars,
        attempts: 1,
      })
    }

    await this.userService.update(userId, { gems: user.gems, levels: user.levels })

    res.json(
      new Response({
        status: 'ok',
      })
    )
    req.log.debug('LevelHandler.addLevel', 'Process completed')
  }
}
