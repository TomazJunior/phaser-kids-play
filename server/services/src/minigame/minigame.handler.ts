import GemAuditService from '../gemAudit/gemAudit.service'
import { GemAudit, GEM_AUDIT_TYPE, MiniGame, MiniGameHighScore } from '../shared/models'
import Response from '../shared/response'
import UserService from '../user/user.service'
import MiniGameService from './minigame.service'
import MiniGameHighScoreService from './minigameHighScore.service'

export class MiniGameHandler {
  logger: any
  gemAuditService: GemAuditService
  miniGameService: MiniGameService
  miniGameHighScoreService: MiniGameHighScoreService
  userService: UserService

  constructor(logger) {
    this.logger = logger
    this.userService = new UserService(logger)
    this.miniGameService = new MiniGameService(logger)
    this.miniGameHighScoreService = new MiniGameHighScoreService(logger)
    this.gemAuditService = new GemAuditService(logger)
  }
  getTopRankedByMiniGameId = async (req, res) => {
    req.log.debug('MiniGameHandler.getTopRankedByMiniGameId', 'Process started')
    const { userId, miniGameId } = req.params
    let { limit } = req.query
    if (!limit) limit = 10;

    if (!userId) return Promise.reject('userId property is required')
    if (!miniGameId) return Promise.reject('miniGameId property is required')

    const data = await this.miniGameHighScoreService.getTopRankedByMiniGameId(parseInt(miniGameId, 10), limit)
    // search by current user score only if it does not exist
    if (data.findIndex(item => item.userId == userId) == -1) {
      const userHighScoreData = await this.miniGameHighScoreService.get(userId, miniGameId)
      data.push(userHighScoreData);
    }

    res.json(new Response(data))
    req.log.debug('MiniGameHandler.getTopRankedByMiniGameId', 'Process completed')
  }

  finished = async (req, res) => {
    req.log.debug('MiniGameHandler.finished', 'Process started')
    const { userId } = req.params
    const { miniGameId, score } = req.body
    if (!score) {
      res.json(new Response({}))
      return
    }
    if (!userId) return Promise.reject('userId property is required')
    if (!miniGameId) return Promise.reject('miniGameId property is required')

    const highScoreData = await this.miniGameHighScoreService.get(userId, miniGameId)

    if (!highScoreData) {
      this.miniGameHighScoreService.add(new MiniGameHighScore({ userId, miniGameId, highscore: score }))
    } else if (score > highScoreData.highscore) {
      this.miniGameHighScoreService.update(userId, miniGameId, { highscore: score })
    }

    const updatedData = await this.miniGameService.add(new MiniGame({ ...req.body, userId }))
    await this.gemAuditService.add(
      new GemAudit({
        userId,
        recordType: GEM_AUDIT_TYPE.MINI_GAME_COMPLETED,
        originId: updatedData.id,
        gems: updatedData.blueGems,
      })
    )

    const user = await this.userService.getOne(userId)
    if (!user.blueGems) user.blueGems = 0
    if (!user.score) user.score = 0
    user.blueGems += updatedData.blueGems
    user.score += updatedData.score
    await this.userService.update(userId, { blueGems: user.blueGems, score: user.score })

    res.json(new Response(updatedData))
    req.log.debug('MiniGameHandler.finished', 'Process completed')
  }
}
