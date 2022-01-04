import axios from 'axios'
import handler from '../../../../pages/api/keys/paypal'

describe('paypal key', () => {
  it('should return the key if user is auth', async () => {
    const req = {}
    jest.mock('../../../../utils/auth', () => {
      req.user = { name: 'paul' }
    })

    const end = jest.fn((value) => value)
    const res = { end }

    await handler(req, res)

    expect(end).toHaveBeenCalledTimes(1)
    expect(end).toHaveBeenCalledWith(expect.any(String))
  })
})
