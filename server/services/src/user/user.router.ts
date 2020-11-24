import { UserHandler } from './user.handler'

export const initialize = (router) => {
  router.post('user/', async (req, res) => {
    const userHandler = new UserHandler(req.log)
    return userHandler.create(req, res)
  })
}
