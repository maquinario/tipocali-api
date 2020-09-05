import dotenv from 'dotenv'

dotenv.config()

export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/tipocali',
  port: process.env.PORT || 5050,
  mailchimpApiKey: process.env.MAILCHIMP_API_KEY,
  mailchimpServerPrefix: process.env.MAILCHIMP_SERVER_PREFIX
}
