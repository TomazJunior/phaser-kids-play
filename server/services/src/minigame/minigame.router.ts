import { MiniGameHandler } from './minigame.handler'

export const initialize = (router) => {
  router.post('user/:userId/minigame/finished', async (req, res) => {
    const miniGameHandler = new MiniGameHandler(req.log)
    return miniGameHandler.finished(req, res)
  })

  router.get('user/:userId/minigame/:miniGameId/rank', async (req, res) => {
    const miniGameHandler = new MiniGameHandler(req.log)
    return miniGameHandler.getTopRankedByMiniGameId(req, res)
  })
}
