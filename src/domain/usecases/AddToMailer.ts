import { AddSubscriberModel } from './AddSubscriber'

export interface MailerResponse {
  status: boolean
}

export default interface AddToMailer {
  add: (subscriberData: AddSubscriberModel) => Promise<MailerResponse>
}
