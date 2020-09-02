import { HttpRequest, HttpResponse } from '../../protocols/http'
import { MissingParamError } from '../../errors/MissingParamError'
import { badRequest } from '../../helpers/HttpHelper'

export class SubscribeController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { name, email } = httpRequest.body
    if (!name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
