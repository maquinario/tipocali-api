import { HttpRequest, HttpResponse } from '../../protocols/http'

export class SubscribeController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { name, email } = httpRequest.body
    if (!name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }
    if (!email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }
  }
}
