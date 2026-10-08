jest.mock('../../../../../server/green-api/green-api.client', () => ({
	greenApiClient: { request: jest.fn() }
}))

import { NextRequest } from 'next/server'

import { greenApiClient } from '../../../../../server/green-api/green-api.client'
import { GreenApiError } from '../../../../../server/green-api/green-api.error'
import { GET, POST } from '../route'

const request = jest.mocked(greenApiClient.request)

const AUTH_COOKIE =
	'idInstance=7103000001; apiTokenInstance=token; apiUrl=https://api.green-api.com'
const CREDENTIALS = {
	idInstance: '7103000001',
	apiTokenInstance: 'token',
	apiUrl: 'https://api.green-api.com'
}

const createRequest = (method: 'GET' | 'POST', cookie = AUTH_COOKIE) =>
	new NextRequest('http://localhost/api/instance/receiving', { method, headers: { cookie } })

describe('GET /api/instance/receiving', () => {
	it('отдаёт только признаки, без webhookUrlToken и прочих настроек', async () => {
		request.mockResolvedValue({
			incomingWebhook: 'no',
			webhookUrl: '',
			webhookUrlToken: 'secret',
			wid: '79876543210@c.us'
		})

		const res = await GET(createRequest('GET'))

		expect(res.status).toBe(200)
		expect(await res.json()).toEqual({
			canReceive: false,
			incomingEnabled: false,
			webhookUrlSet: false
		})
		expect(request).toHaveBeenCalledWith(CREDENTIALS, 'getSettings', { httpMethod: 'GET' })
	})

	it('без cookie отвечает 401', async () => {
		const res = await GET(createRequest('GET', ''))

		expect(res.status).toBe(401)
		expect(request).not.toHaveBeenCalled()
	})

	it('пробрасывает ошибку GREEN-API', async () => {
		request.mockRejectedValue(new GreenApiError(429, 'Слишком много запросов'))

		const res = await GET(createRequest('GET'))

		expect(res.status).toBe(429)
	})
})

describe('POST /api/instance/receiving', () => {
	it('включает входящие фиксированным набором настроек', async () => {
		request.mockResolvedValue({ saveSettings: true })

		const res = await POST(createRequest('POST'))

		expect(res.status).toBe(200)
		expect(await res.json()).toEqual({ saveSettings: true })
		expect(request).toHaveBeenCalledWith(CREDENTIALS, 'setSettings', {
			httpMethod: 'POST',
			body: { incomingWebhook: 'yes', webhookUrl: '' }
		})
	})

	it('без cookie отвечает 401', async () => {
		const res = await POST(createRequest('POST', ''))

		expect(res.status).toBe(401)
		expect(request).not.toHaveBeenCalled()
	})
})
