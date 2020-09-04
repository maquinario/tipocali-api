import faker from 'faker'
import { SubscribeController } from './SubscribeController'
import { MissingParamError, InvalidParamError, ServerError, MailerError } from '../../errors'
import { EmailValidator, HttpRequest } from '../../protocols'
import AddSubscriber, { AddSubscriberModel } from '../../../domain/usecases/AddSubscriber'
import AddToMailer, { MailerResponse } from '../../../domain/usecases/AddToMailer'
import SubscriberModel from '../../../domain/models/Subscriber'

interface SutTypes {
  sut: SubscribeController
  emailValidatorStub: EmailValidator
  addSubscriberStub: AddSubscriber
  addToMailerStub: AddToMailer
}

const fakeSubscriber = {
  id: faker.random.uuid(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email()
  }
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddSubscriber = (): AddSubscriber => {
  class AddSubscriberStub implements AddSubscriber {
    async add (subscriber: AddSubscriberModel): Promise<SubscriberModel> {
      return await new Promise(resolve => resolve(fakeSubscriber))
    }
  }
  return new AddSubscriberStub()
}

const makeAddToMailer = (): AddToMailer => {
  class AddToMailerStub implements AddToMailer {
    async add (subscriberData: AddSubscriberModel): Promise<MailerResponse> {
      return await new Promise(resolve => resolve({ status: true }))
    }
  }
  return new AddToMailerStub()
}

const makeSut = (): SutTypes => {
  const addSubscriberStub = makeAddSubscriber()
  const emailValidatorStub = makeEmailValidator()
  const addToMailerStub = makeAddToMailer()
  const sut = new SubscribeController(emailValidatorStub, addSubscriberStub, addToMailerStub)
  return {
    sut, emailValidatorStub, addSubscriberStub, addToMailerStub
  }
}

describe('Subscribe Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: faker.internet.email()
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: faker.name.firstName()
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if AddSubscriber throws', async () => {
    const { sut, addSubscriberStub } = makeSut()
    jest.spyOn(addSubscriberStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddSubscriber with correct values', async () => {
    const { sut, addSubscriberStub } = makeSut()
    const addSpy = jest.spyOn(addSubscriberStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should call AddToMailer with correct values', async () => {
    const { sut, addToMailerStub } = makeSut()
    const addSpy = jest.spyOn(addToMailerStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if AddToMailer throws', async () => {
    const { sut, addToMailerStub } = makeSut()
    jest.spyOn(addToMailerStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new MailerError('Could not subscribe user')))
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: fakeSubscriber.name,
        email: fakeSubscriber.email
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(fakeSubscriber)
  })
})
