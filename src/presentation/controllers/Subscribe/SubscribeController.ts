import { HttpRequest, HttpResponse } from '../../protocols/Http'
import { MissingParamError } from '../../errors/MissingParamError'
import { badRequest } from '../../helpers/HttpHelper'
import Controller from '../../protocols/Controller'
import { EmailValidator } from '../../protocols/EmailValidator'
import { InvalidParamError } from '../../errors/InvalidParamError'

export class SubscribeController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const isValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
