import faker from 'faker'
import { SubscribeController } from './SubscribeController'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, HttpRequest } from '../../protocols'
import AddSubscriber, { AddSubscriberModel } from '../../../domain/usecases/AddSubscriber'
import SubscriberModel from '../../../domain/models/Subscriber'

interface SutTypes {
  sut: SubscribeController
  emailValidatorStub: EmailValidator
  addSubscriberStub: AddSubscriber
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
    add (subscriber: AddSubscriberModel): SubscriberModel {
      const fakerSubscriber = {
        id: faker.random.uuid(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email()
      }
      return fakerSubscriber
    }
  }
  return new AddSubscriberStub()
}

const makeSut = (): SutTypes => {
  const addSubscriberStub = makeAddSubscriber()
  const emailValidatorStub = makeEmailValidator()
  const sut = new SubscribeController(emailValidatorStub, addSubscriberStub)
  return {
    sut, emailValidatorStub, addSubscriberStub
  }
}

describe('Subscribe Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
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
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: faker.name.firstName()
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest()
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeRequest()
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if AddSubscriber throws', () => {
    const { sut, addSubscriberStub } = makeSut()
    jest.spyOn(addSubscriberStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddSubscriber with correct values', () => {
    const { sut, addSubscriberStub } = makeSut()
    const addSpy = jest.spyOn(addSubscriberStub, 'add')
    const httpRequest = makeFakeRequest()
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
