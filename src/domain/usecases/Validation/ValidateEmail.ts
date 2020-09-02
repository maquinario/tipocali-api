import { EmailValidator } from '../../../presentation/protocols'

export default class ValidateEmail implements EmailValidator {
  isValid (email: string): boolean {
    return false
  }
}
