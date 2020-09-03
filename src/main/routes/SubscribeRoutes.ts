import { Router } from 'express'
import { adaptRoute } from '../adapters/ExpressRouteAdapter'
import { makeSubscribeController } from '../factories/Subscribe'

export default (router: Router): void => {
  router.post('/subscribe', adaptRoute(makeSubscribeController()))
}
