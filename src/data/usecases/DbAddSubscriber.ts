/* eslint-disable @typescript-eslint/return-await */
import AddSubscriber, { AddSubscriberModel } from '../../domain/usecases/AddSubscriber'
import SubscriberModel from '../../domain/models/Subscriber'
import { AddSubscriberRepository } from '../protocols/AddSubscriberRepository'

export class DbAddSubscriber implements AddSubscriber {
  constructor (private readonly addSubscriberRepository: AddSubscriberRepository) {}

  async add (subscriberData: AddSubscriberModel): Promise<SubscriberModel> {
    const subscriber = await this.addSubscriberRepository.add(subscriberData)
    return subscriber
  }
}
