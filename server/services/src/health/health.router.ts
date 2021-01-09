import Response from '../shared/response'

export const initialize = (router) => {
  router.get('ping', async (req, res) => {
    return res.json(new Response({ status: 'ok' }))
  })
  
}
