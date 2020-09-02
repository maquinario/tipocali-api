import ValidateEmail from './ValidateEmail'

describe('EmailValidator', () => {
  test('Should return false if EmailValidation returns false', () => {
    const sut = new ValidateEmail()
    const isValid = sut.isValid('not a valid email')
    expect(isValid).toBe(false)
  })
})
