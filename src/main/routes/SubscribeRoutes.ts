import { Router } from 'express'

export default (router: Router): void => {
  router.post('/subscribe', (req, res) => {
    res.json({ ok: 'ok' })
  })
}
