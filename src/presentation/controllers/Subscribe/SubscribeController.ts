import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../../protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/HttpHelper'
import AddSubscriber from '../../../domain/usecases/AddSubscriber'

export class SubscribeController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addSubscriber: AddSubscriber
  ) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const { name, email } = httpRequest.body
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
      const subscriber = this.addSubscriber.add({ name, email })
      return {
        statusCode: 200,
        body: subscriber
      }
    } catch (error) {
      return serverError()
    }
  }
}
