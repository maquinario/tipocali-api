import { HttpRequest, HttpResponse } from '../../protocols/Http'
import { MissingParamError } from '../../errors/MissingParamError'
import { badRequest } from '../../helpers/HttpHelper'
import Controller from '../../protocols/Controller'

export class SubscribeController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
