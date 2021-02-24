import { UserHandler } from './user.handler'

export const initialize = (router) => {
  router.get('user/:userId', async (req, res) => {
    const userHandler = new UserHandler(req.log)
    return userHandler.getOne(req, res)
  })
  router.post('user/', async (req, res) => {
    const userHandler = new UserHandler(req.log)
    return userHandler.create(req, res)
  })
  router.put('user/:userId/player-definition/:playerDefinitionKey/gems/:gems', async (req, res) => {
    const userHandler = new UserHandler(req.log)
    return userHandler.updatePlayerDefinition(req, res)
  })
  router.post('user/:userId/gems/:gems', async (req, res) => {
    const userHandler = new UserHandler(req.log)
    return userHandler.buyGemsViaAds(req, res)
  })
  router.post('user/:userId/blue-gems/:gems', async (req, res) => {
    const userHandler = new UserHandler(req.log)
    return userHandler.buyBlueGemsViaAds(req, res)
  })
  router.put('user/:userId/score/:score', async (req, res) => {
    const userHandler = new UserHandler(req.log)
    return userHandler.updatePlayScore(req, res)
  })
}
