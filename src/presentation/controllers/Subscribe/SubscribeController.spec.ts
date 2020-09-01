import faker from 'faker'
import { SubscribeController } from './SubscribeController'

interface SubscriberModel {
  id: string
  name: string
  email: string
}

const makeSubscriber = (): SubscriberModel => {
  return {
    id: faker.random.uuid(),
    name: faker.name.firstName(),
    email: faker.internet.email()
  }
}

describe('Subscribe Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SubscribeController()
    const httpRequest = {
      body: makeSubscriber()
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
