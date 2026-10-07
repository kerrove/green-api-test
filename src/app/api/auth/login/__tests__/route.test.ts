jest.mock('../../../../../server/green-api/green-api.client', () => ({
	greenApiClient: { request: jest.fn() }
}))

import { NextRequest } from 'next/server'

import { greenApiClient } from '../../../../../server/green-api/green-api.client'
import { GreenApiError } from '../../../../../server/green-api/green-api.error'
import { POST } from '../route'

const request = jest.mocked(greenApiClient.request)

const LOGIN_DATA = {
	idInstance: '3100000001',
	apiTokenInstance: 'token',
	apiUrl: 'https://3100.api.green-api.com'
}

const createRequest = (body: unknown) =>
	new NextRequest('http://localhost/api/auth/login', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body)
	})

describe('POST /api/auth/login', () => {
	const mockInstance = (stateInstance: string, typeInstance?: string) =>
		request.mockResolvedValueOnce({ stateInstance }).mockResolvedValueOnce({ typeInstance })

	it('не-WhatsApp инстанс отвергает без cookie', async () => {
		mockInstance('authorized', 'v3')

		const res = await POST(createRequest(LOGIN_DATA))

		expect(res.status).toBe(422)
		expect(await res.json()).toEqual({
			message: 'Это не WhatsApp-инстанс. Создайте инстанс WhatsApp в личном кабинете GREEN-API'
		})
		expect(res.cookies.get('apiTokenInstance')).toBeUndefined()
	})

	it('пускает WhatsApp-инстанс, у которого getSettings не возвращает typeInstance', async () => {
		request
			.mockResolvedValueOnce({ stateInstance: 'authorized' })
			.mockResolvedValueOnce({ wid: '79876543210@c.us', enableLidMode: 'no' })

		const res = await POST(createRequest(LOGIN_DATA))

		expect(res.status).toBe(200)
		expect(res.cookies.get('apiTokenInstance')).toMatchObject({ value: 'token', httpOnly: true })
	})

	it('при authorized ставит httpOnly-cookie и не отдаёт токен в теле', async () => {
		mockInstance('authorized', 'whatsapp')

		const res = await POST(createRequest(LOGIN_DATA))

		expect(res.status).toBe(200)
		expect(await res.json()).toEqual({ idInstance: LOGIN_DATA.idInstance })
		expect(request).toHaveBeenLastCalledWith(LOGIN_DATA, 'getSettings', { httpMethod: 'GET' })
		expect(res.cookies.get('apiTokenInstance')).toMatchObject({ value: 'token', httpOnly: true })
		expect(res.cookies.get('idInstance')?.value).toBe(LOGIN_DATA.idInstance)
		expect(res.cookies.get('apiUrl')?.value).toBe(LOGIN_DATA.apiUrl)
		expect(request).toHaveBeenNthCalledWith(1, LOGIN_DATA, 'getStateInstance', {
			httpMethod: 'GET'
		})
	})

	it('невалидные данные отвергает без запроса в GREEN-API', async () => {
		const res = await POST(createRequest({ ...LOGIN_DATA, apiUrl: 'https://evil.example.com' }))

		expect(res.status).toBe(400)
		expect(request).not.toHaveBeenCalled()
	})

	it('неавторизованный инстанс отвергает с пояснением', async () => {
		request.mockResolvedValue({ stateInstance: 'notAuthorized' })

		const res = await POST(createRequest(LOGIN_DATA))

		expect(res.status).toBe(403)
		expect(await res.json()).toEqual({
			message: 'К инстансу не подключён WhatsApp. Отсканируйте QR-код в личном кабинете GREEN-API'
		})
		expect(res.cookies.get('apiTokenInstance')).toBeUndefined()
	})

	it('неверный токен возвращает 401 без cookie', async () => {
		request.mockRejectedValue(new GreenApiError(401, 'Неверные idInstance или apiTokenInstance'))

		const res = await POST(createRequest(LOGIN_DATA))

		expect(res.status).toBe(401)
		expect(res.cookies.get('apiTokenInstance')).toBeUndefined()
	})
})
