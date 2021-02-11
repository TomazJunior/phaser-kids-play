import { SkillItemHandler } from './skillItem.handler'

export const initialize = (router) => {
  router.post('user/:userId/skill-item/purchase', async (req, res) => {
    const skillItemHandler = new SkillItemHandler(req.log)
    return skillItemHandler.purchase(req, res)
  })

  router.post('user/:userId/skill-item/reward', async (req, res) => {
    const skillItemHandler = new SkillItemHandler(req.log)
    return skillItemHandler.reward(req, res)
  })

  router.post('user/:userId/skill-item/use', async (req, res) => {
    const skillItemHandler = new SkillItemHandler(req.log)
    return skillItemHandler.useItem(req, res)
  })
}
