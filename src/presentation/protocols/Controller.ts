import { HttpRequest, HttpResponse } from './Http'

export default interface Controller {
  handle: (httpRequest: HttpRequest) => HttpResponse
}
