import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../../protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/HttpHelper'
import AddSubscriber from '../../../domain/usecases/AddSubscriber'
import AddToMailer from '../../../domain/usecases/AddToMailer'

export class SubscribeController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addSubscriber: AddSubscriber,
    private readonly addToMailer: AddToMailer
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
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
      const subscriber = await this.addSubscriber.add({ name, email })
      const mailerProvider = await this.addToMailer.add({ name, email })
      if (!mailerProvider) {
        return badRequest(new ServerError())
      }
      return ok(subscriber)
    } catch (error) {
      return serverError()
    }
  }
}
