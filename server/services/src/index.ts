'use strict'
import { DynamoDBService } from './shared/dynamodb.service'
import { initialize as initializeUser } from './user/user.router'
import { initialize as initializeDevice } from './device/device.router'
import { initialize as initializeLevel } from './level/level.router'

export async function handler(event: any, context: any) {
  const router = require('lambda-api')({
    logger: {
      level: process.env.LoggerLevel,
      stack: process.env.LoggerStack,
    },
  })

  router.use(async (req, res, next) => {
    res.cors()
    if (event.requestContext.stage === 'local') {
      try {
        req.log.debug('Create tables locally')
        await DynamoDBService.getInstance().createTables()
      } catch (error) {
        req.log.error(error)
      }
    }
    next()
  })

  router.use((error, req, res, next) => {
    req.log.error(error)
    res.cors()
    res.status(error.statusCode || (error.response && error.response.status) || 500).send({ error: error.message })
    next()
  })

  await initializeUser(router)
  await initializeDevice(router)
  await initializeLevel(router)

  return router.run(event, context)
}
