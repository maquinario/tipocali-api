export class MailerError extends Error {
  constructor (errorName: string) {
    super(`Could not subscribe to mailing: ${errorName}`)
    this.name = 'MailerError'
  }
}
