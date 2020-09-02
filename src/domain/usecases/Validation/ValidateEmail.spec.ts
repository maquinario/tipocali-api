import ValidateEmail from './ValidateEmail'
import faker from 'faker'

const makeSut = (): ValidateEmail => {
  return new ValidateEmail()
}

describe('EmailValidator', () => {
  test('Should return false if EmailValidation returns false', () => {
    const sut = makeSut()
    const isValid = sut.isValid('not a valid email')
    expect(isValid).toBe(false)
  })
  test('Should return true if EmailValidation returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid(faker.internet.email())
    expect(isValid).toBe(true)
  })
})
