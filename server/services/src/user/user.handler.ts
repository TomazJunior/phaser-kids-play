import { User } from '../shared/models'
import Response from '../shared/response'
import UserService from './user.service'

export class UserHandler {
  logger: any
  userService: UserService
  constructor(logger) {
    this.logger = logger
    this.userService = new UserService(logger)
  }

  create = async (req, res) => {
    req.log.debug('UserHandler.create', 'Process started')
    const user = new User({
      active: true
    })
    const userDB = await this.userService.add(user)
    res.json(new Response({ ...userDB }))
    req.log.debug('UserHandler.create', 'Process completed')
  }
}
