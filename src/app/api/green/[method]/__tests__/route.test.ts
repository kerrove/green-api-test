jest.mock('../../../../../server/green-api/green-api.client', () => ({
	greenApiClient: { request: jest.fn() }
}))

import { NextRequest } from 'next/server'

import { greenApiClient } from '../../../../../server/green-api/green-api.client'
import { GreenApiError } from '../../../../../server/green-api/green-api.error'
import { DELETE, GET, POST } from '../route'

const request = jest.mocked(greenApiClient.request)

const AUTH_COOKIE =
	'idInstance=3100000001; apiTokenInstance=token; apiUrl=https://api.green-api.com'
const CREDENTIALS = {
	idInstance: '3100000001',
	apiTokenInstance: 'token',
	apiUrl: 'https://api.green-api.com'
}

const context = (method: string) => ({ params: Promise.resolve({ method }) })

const createRequest = (path: string, init: { method: string; body?: unknown; cookie?: string }) =>
	new NextRequest(`http://localhost/api/green/${path}`, {
		method: init.method,
		headers: { cookie: init.cookie ?? AUTH_COOKIE, 'content-type': 'application/json' },
		body: init.body === undefined ? undefined : JSON.stringify(init.body)
	})

describe('/api/green/[method]', () => {
	it('проксирует sendMessage с кредами из cookie', async () => {
		request.mockResolvedValue({ idMessage: 'm1' })
		const body = { chatId: '10000000', message: 'Привет' }

		const res = await POST(
			createRequest('sendMessage', { method: 'POST', body }),
			context('sendMessage')
		)

		expect(res.status).toBe(200)
		expect(await res.json()).toEqual({ idMessage: 'm1' })
		expect(request).toHaveBeenCalledWith(CREDENTIALS, 'sendMessage', {
			httpMethod: 'POST',
			id: undefined,
			body
		})
	})

	it('пробрасывает id для deleteNotification', async () => {
		request.mockResolvedValue({ result: true })

		const res = await DELETE(
			createRequest('deleteNotification?id=77', { method: 'DELETE' }),
			context('deleteNotification')
		)

		expect(res.status).toBe(200)
		expect(request).toHaveBeenCalledWith(CREDENTIALS, 'deleteNotification', {
			httpMethod: 'DELETE',
			id: '77',
			body: undefined
		})
	})

	it('deleteNotification без id отвечает 400', async () => {
		const res = await DELETE(
			createRequest('deleteNotification', { method: 'DELETE' }),
			context('deleteNotification')
		)

		expect(res.status).toBe(400)
		expect(request).not.toHaveBeenCalled()
	})

	it('без cookie отвечает 401', async () => {
		const res = await GET(
			createRequest('receiveNotification', { method: 'GET', cookie: '' }),
			context('receiveNotification')
		)

		expect(res.status).toBe(401)
		expect(request).not.toHaveBeenCalled()
	})

	it('неизвестный метод отвечает 404', async () => {
		const res = await POST(
			createRequest('getStateInstance', { method: 'POST', body: {} }),
			context('getStateInstance')
		)

		expect(res.status).toBe(404)
	})

	it('метод с чужим HTTP-глаголом отвечает 404', async () => {
		const res = await GET(createRequest('sendMessage', { method: 'GET' }), context('sendMessage'))

		expect(res.status).toBe(404)
	})

	it('ошибку GREEN-API отдаёт с её статусом и сообщением', async () => {
		request.mockRejectedValue(new GreenApiError(429, 'Слишком много запросов'))

		const res = await GET(
			createRequest('receiveNotification', { method: 'GET' }),
			context('receiveNotification')
		)

		expect(res.status).toBe(429)
		expect(await res.json()).toEqual({ message: 'Слишком много запросов' })
	})
})
