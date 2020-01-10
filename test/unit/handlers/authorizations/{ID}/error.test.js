'use strict'

jest.mock('@mojaloop/central-services-logger', () => {
  return {
    info: jest.fn() // suppress info output
  }
})
const Hapi = require('@hapi/hapi')

const Mockgen = require('../../../../util/mockgen.js')
const Helper = require('../../../../util/helper')
const Handler = require('../../../../../src/domain/authorizations/authorizations')

const server = new Hapi.Server()

/**
 * Tests for /authorizations/{ID}/error
 */
describe('/authorizations/{ID}', () => {
  beforeAll(async () => {
    await server.register(Helper.defaultServerOptions)
  })

  afterAll(() => {
    server.stop()
  })

  beforeEach(() => {
    Handler.forwardAuthorizationError = jest.fn().mockResolvedValue()
  })

  describe('PUT', () => {
    const requests = Mockgen().requestsAsync('/authorizations/{ID}/error', 'put')

    it('returns a 202 response code', async () => {
      // Arrange
      const mock = await requests
      const options = {
        method: 'put',
        url: '' + mock.request.path,
        headers: Helper.defaultHeaders(),
        payload: mock.request.body
      }

      // Act
      const response = await server.inject(options)

      // Assert
      expect(response.statusCode).toBe(200)
      expect(Handler.forwardAuthorizationError).toHaveBeenCalledTimes(1)
    })
  })
})
