import { HttpRequest, HttpResponse } from '../../protocols/http'
import { MissingParamError } from '../../errors/MissingParamError'

export class SubscribeController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { name, email } = httpRequest.body
    if (!name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }
    if (!email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
  }
}
