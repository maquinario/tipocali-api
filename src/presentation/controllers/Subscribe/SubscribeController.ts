import { HttpRequest, HttpResponse } from '../../protocols/Http'
import { MissingParamError } from '../../errors/MissingParamError'
import { badRequest } from '../../helpers/HttpHelper'
import Controller from '../../protocols/Controller'
import { EmailValidator } from '../../protocols/EmailValidator'
import { InvalidParamError } from '../../errors/InvalidParamError'
import { ServerError } from '../../errors/ServerError'

export class SubscribeController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
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
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
