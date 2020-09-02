import faker from 'faker'
import { DbAddSubscriber } from './DbAddSubscriber'
import { AddSubscriberModel } from '../../domain/usecases/AddSubscriber'
import SubscriberModel from '../../domain/models/Subscriber'
import { AddSubscriberRepository } from '../protocols/AddSubscriberRepository'

interface SutTypes {
  sut: DbAddSubscriber
  addSubscriberRepositoryStub: AddSubscriberRepository
}

const subscriber = {
  id: faker.random.uuid(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email()
}

const makeAddSubscriberRepository = (): AddSubscriberRepository => {
  class AddSubscriberRepositoryStub implements AddSubscriberRepository {
    async add (subscriberData: AddSubscriberModel): Promise<SubscriberModel> {
      return await new Promise(resolve => resolve(subscriber))
    }
  }
  return new AddSubscriberRepositoryStub()
}

const makeSut = (): SutTypes => {
  const addSubscriberRepositoryStub = makeAddSubscriberRepository()
  const sut = new DbAddSubscriber(addSubscriberRepositoryStub)

  return { sut, addSubscriberRepositoryStub }
}

describe('DbAddSubscriber Usecase', () => {
  test('Should call AddSubscriberRepository with correct values', async () => {
    const { sut, addSubscriberRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSubscriberRepositoryStub, 'add')
    const { name, email } = subscriber
    await sut.add({ name, email })
    expect(addSpy).toHaveBeenCalledWith({ name, email })
  })
})
