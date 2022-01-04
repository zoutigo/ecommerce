import { getError, onError } from '../../utils/error'

jest.mock('../../utils/db')

describe('getError', () => {
  it('should return err.reponse.data.message', () => {
    const err = {
      response: {
        data: {
          message: 'bad request',
        },
      },
    }
    const error = getError(err)
    expect(error).toEqual('bad request')
  })
  it('should return err.message', () => {
    const err = {
      message: 'Bad request',
    }
    const error = getError(err)
    expect(error).toEqual('Bad request')
  })
})

describe('onError', () => {
  it('should return a string message', async () => {
    const err = 1
    const req = {}
    const next = jest.fn()
    const send = jest.fn()

    const status = jest.fn(() => {
      return {
        send,
      }
    })

    const res = {
      status,
    }

    await onError(err, req, res, next)

    const call = send.mock.calls[0][0].message

    expect(call).toEqual(err.toString())
    expect(status).toHaveBeenCalledWith(500)
    expect(status).toHaveBeenCalledTimes(1)
    expect(send).toHaveBeenCalledTimes(1)
  })
})
