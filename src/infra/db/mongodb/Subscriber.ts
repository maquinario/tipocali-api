import { AddSubscriberRepository } from '../../../data/protocols/AddSubscriberRepository'
import { AddSubscriberModel } from '../../../domain/usecases/AddSubscriber'
import SubscriberModel from '../../../domain/models/Subscriber'
import { MongoHelper } from './helpers/MongoHelper'

export class SubscriberMongoRepository implements AddSubscriberRepository {
  async add (subscribeData: AddSubscriberModel): Promise<SubscriberModel> {
    const subscriberCollection = MongoHelper.getCollection('subscribers')
    const result = await subscriberCollection.insertOne(subscribeData)
    const subscriber = result.ops[0]
    return MongoHelper.map(subscriber)
  }
}
