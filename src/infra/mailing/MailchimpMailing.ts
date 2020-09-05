import Mailchimp from 'mailchimp-api-v3'
import AddToMailer, { MailerResponse } from '../../domain/usecases/AddToMailer'
import { AddSubscriberModel } from '../../domain/usecases/AddSubscriber'
import env from '../../main/config/env'

export default class AddToMailchimp implements AddToMailer {
  mailchimp: Mailchimp
  constructor () {
    this.mailchimp = new Mailchimp(env.mailchimpApiKey)
  }

  async add (subscriberData: AddSubscriberModel): Promise<MailerResponse> {
    const user = await this.mailchimp.post('/lists/4f9d7854cd/members', {
      email_address: subscriberData.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: subscriberData.name
      },
      tags: ['tipocali']
    })
    return { status: !!user }
  }
}
