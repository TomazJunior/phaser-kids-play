import { PurchaseHandler } from './purchase.handler'

export const initialize = (router) => {
  router.post('user/:userId/purchase', async (req, res) => {
    const purchaseHandler = new PurchaseHandler(req.log)
    return purchaseHandler.addPurchase(req, res)
  })
}
