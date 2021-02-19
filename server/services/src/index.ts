'use strict'
import { DynamoDBService } from './shared/dynamodb.service'
import { initialize as initializeUser } from './user/user.router'
import { initialize as initializeDevice } from './device/device.router'
import { initialize as initializeLevel } from './level/level.router'
import { initialize as initializeSkillItem } from './skillItem/skillItem.router'
import { initialize as initializeHealth } from './health/health.router'
import { initialize as initializePurchase } from './purchase/purchase.router'
import { initialize as initializeSettings } from './settings/settings.router'
import { initialize as initializeMiniGame } from './minigame/minigame.router'


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
  await initializeSkillItem(router)
  await initializeHealth(router)
  await initializePurchase(router)
  await initializeSettings(router)
  await initializeMiniGame(router)

  return router.run(event, context)
}
