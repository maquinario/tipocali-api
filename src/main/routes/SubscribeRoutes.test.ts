import request from 'supertest'
import app from '../config/app'
import faker from 'faker'

describe('Subscribe Routes', () => {
  test('Should return a subscriber on success', async () => {
    await request(app)
      .post('/api/subscribe')
      .send({
        name: faker.name.firstName(),
        email: faker.internet.email()
      })
      .expect(200)
  })
})
