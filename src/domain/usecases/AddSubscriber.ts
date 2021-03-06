import SubscriberModel from '../models/Subscriber'

export interface AddSubscriberModel {
  name: string
  email: string
}

export default interface AddSubscriber {
  add: (subscriberData: AddSubscriberModel) => Promise<SubscriberModel>
}
