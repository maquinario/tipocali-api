import faker from 'faker'
import { SubscribeController } from './SubscribeController'
import { MissingParamError } from '../../errors/MissingParamError'

describe('Subscribe Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SubscribeController()
    const httpRequest = {
      body: {
        email: faker.internet.email()
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const sut = new SubscribeController()
    const httpRequest = {
      body: {
        name: faker.name.firstName()
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})
