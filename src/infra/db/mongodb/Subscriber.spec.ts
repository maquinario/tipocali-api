import faker from 'faker'
import { MongoHelper } from './helpers/MongoHelper'
import { SubscriberMongoRepository } from './Subscriber'

const fakeSubscriber = {
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email()
}

describe('Subscriber Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const subscriberCollection = MongoHelper.getCollection('subscribers')
    await subscriberCollection.deleteMany({})
  })

  const makeSut = (): SubscriberMongoRepository => {
    return new SubscriberMongoRepository()
  }

  test('Should return a subscriber on success', async () => {
    const sut = makeSut()
    const { name, email } = fakeSubscriber
    const subscriber = await sut.add({ name, email })
    expect(subscriber).toBeTruthy()
    expect(subscriber.id).toBeTruthy()
    expect(subscriber.name).toBe(fakeSubscriber.name)
    expect(subscriber.email).toBe(fakeSubscriber.email)
  })
})
