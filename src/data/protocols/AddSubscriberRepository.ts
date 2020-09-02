import { AddSubscriberModel } from '../../domain/usecases/AddSubscriber'
import SubscriberModel from '../../domain/models/Subscriber'

export interface AddSubscriberRepository {
  add: (subscriber: AddSubscriberModel) => Promise<SubscriberModel>
}
