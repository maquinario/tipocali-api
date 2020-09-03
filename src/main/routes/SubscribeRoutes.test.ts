import request from 'supertest'
import app from '../config/app'
import faker from 'faker'
import { MongoHelper } from '../../infra/db/mongodb/helpers/MongoHelper'

describe('Subscribe Routes', () => {
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
  test('Should return a subscriber on success', async () => {
    await request(app)
      .post('/api/subscribe')
      .send({
        name: faker.name.firstName(),
        email: faker.internet.email()
      })
      .expect(200)
  })
})
