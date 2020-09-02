import { EmailValidator } from '../../../presentation/protocols'

export default class ValidateEmail implements EmailValidator {
  isValid (email: string): boolean {
    // eslint-disable-next-line no-useless-escape
    const exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return exp.test(String(email).toLowerCase())
  }
}
