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
  router.post('user/:userId/gems/:gems', async (req, res) => {
    const userHandler = new UserHandler(req.log)
    return userHandler.buyGemsViaAds(req, res)
  })
  router.post('user/:userId/blue-gems/:gems', async (req, res) => {
    const userHandler = new UserHandler(req.log)
    return userHandler.buyBlueGemsViaAds(req, res)
  })
}
