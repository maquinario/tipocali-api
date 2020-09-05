import AddToMailchimp from './MailchimpMailing'
import faker from 'faker'

describe('MailchimpMailing', () => {
  test('Should call AddToMailchimp with correct values', async () => {
    const mailchimp = new AddToMailchimp()
    const mailchimpSpy = jest.spyOn(mailchimp, 'add')
    const subscriberData = {
      name: faker.name.firstName(),
      email: faker.internet.email()
    }
    await mailchimp.add(subscriberData)
    expect(mailchimpSpy).toHaveBeenCalledWith(subscriberData)
  })
})
