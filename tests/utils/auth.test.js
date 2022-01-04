import { isAuth, signToken } from '../../utils/auth'
import data from '../../utils/datas'

const user = data.users[0]

describe('signToken', () => {
  it('should return a signed token', () => {
    const token = signToken(user)
    expect(typeof token === 'string').toBeTruthy()
  })
})

describe('isAuth', () => {
  const next = jest.fn()

  it('should be 42', () => {
    const mockFn2 = jest.fn(() => 42)
    expect(mockFn2()).toBe(42)
  })

  it('Should call next', async () => {
    const token = signToken(user)
    const reqMock = jest.fn().mockReturnValue({
      user,
      headers: { authorization: `Bearer ${token}` },
    })

    const res = jest.fn()

    await isAuth(reqMock(), res, next)

    expect(reqMock).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should send status 401 for invalid token', async () => {
    const reqMock = jest.fn().mockReturnValue({
      user,
      headers: { authorization: `hello` },
    })
    const send = jest.fn((value) => value)
    const status = jest.fn(() => ({ send }))
    const res = {
      status,
    }

    await isAuth(reqMock(), res, next)

    expect(reqMock).toHaveBeenCalledTimes(1)
    expect(status).toHaveBeenCalledWith(401)
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    )
  })

  it('should send status 401 and message if no token provided', async () => {
    const reqMock = jest.fn().mockReturnValue({
      user,
      headers: { authorization: null },
    })
    const send = jest.fn((value) => value)
    const status = jest.fn(() => ({ send }))
    const res = {
      status,
    }

    await isAuth(reqMock(), res, next)

    expect(reqMock).toHaveBeenCalledTimes(1)
    expect(status).toHaveBeenCalledWith(401)
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    )
  })
})
