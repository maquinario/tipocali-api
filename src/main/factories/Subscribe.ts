import { SubscribeController } from '../../presentation/controllers/Subscribe/SubscribeController'
import ValidateEmail from '../../domain/usecases/Validation/ValidateEmail'
import { DbAddSubscriber } from '../../data/usecases/DbAddSubscriber'
import { SubscriberMongoRepository } from '../../infra/db/mongodb/Subscriber'

export const makeSubscribeController = (): SubscribeController => {
  const emailValidator = new ValidateEmail()
  const subscriberMongoRepository = new SubscriberMongoRepository()
  const addSubscriber = new DbAddSubscriber(subscriberMongoRepository)
  const subscribeController = new SubscribeController(emailValidator, addSubscriber)
  return subscribeController
}
