import { LevelHandler } from './level.handler'

export const initialize = (router) => {
  router.post('user/:userId/level', async (req, res) => {
    const levelHandler = new LevelHandler(req.log)
    return levelHandler.addLevel(req, res)
  })
}
