import { EnumGreenMethod } from 'types/green-api.types'

import { GreenApiClient } from '../green-api.client'
import { GreenApiError } from '../green-api.error'

const CREDENTIALS = {
	idInstance: '3100000001',
	apiTokenInstance: 'token',
	apiUrl: 'https://3100.api.green-api.com/'
}

const createClient = (response: Response | Error) => {
	const fetcher = jest.fn(async () => {
		if (response instanceof Error) throw response
		return response
	})
	return { client: new GreenApiClient(fetcher), fetcher }
}

describe('GreenApiClient.buildUrl', () => {
	const { client } = createClient(new Response())

	it('собирает URL по шаблону waInstance/method/token', () => {
		expect(client.buildUrl(CREDENTIALS, EnumGreenMethod.SEND_MESSAGE)).toBe(
			'https://3100.api.green-api.com/waInstance3100000001/sendMessage/token'
		)
	})

	it('добавляет receiveTimeout для receiveNotification', () => {
		expect(client.buildUrl(CREDENTIALS, EnumGreenMethod.RECEIVE_NOTIFICATION)).toBe(
			'https://3100.api.green-api.com/waInstance3100000001/receiveNotification/token?receiveTimeout=20'
		)
	})

	it('добавляет id в конец пути', () => {
		expect(client.buildUrl(CREDENTIALS, EnumGreenMethod.DELETE_NOTIFICATION, '42')).toBe(
			'https://3100.api.green-api.com/waInstance3100000001/deleteNotification/token/42'
		)
	})
})

describe('GreenApiClient.request', () => {
	it('отправляет JSON-тело и возвращает распарсенный ответ', async () => {
		const { client, fetcher } = createClient(Response.json({ idMessage: 'abc' }))

		const data = await client.request(CREDENTIALS, EnumGreenMethod.SEND_MESSAGE, {
			httpMethod: 'POST',
			body: { chatId: '1', message: 'hi' }
		})

		expect(data).toEqual({ idMessage: 'abc' })
		const [, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit]
		expect(init.method).toBe('POST')
		expect(init.body).toBe(JSON.stringify({ chatId: '1', message: 'hi' }))
		expect(init.cache).toBe('no-store')
	})

	it('пустой ответ превращает в null', async () => {
		const { client } = createClient(new Response(''))

		await expect(
			client.request(CREDENTIALS, EnumGreenMethod.RECEIVE_NOTIFICATION, { httpMethod: 'GET' })
		).resolves.toBeNull()
	})

	it('на 401 бросает GreenApiError с понятным сообщением', async () => {
		const { client } = createClient(new Response('', { status: 401 }))

		await expect(
			client.request(CREDENTIALS, EnumGreenMethod.GET_STATE_INSTANCE, { httpMethod: 'GET' })
		).rejects.toEqual(new GreenApiError(401, 'Неверные idInstance или apiTokenInstance'))
	})

	it('добавляет к сообщению причину из JSON-ответа GREEN-API', async () => {
		const { client } = createClient(
			Response.json({ message: 'bad phone number, valid from 11 to 16 digits' }, { status: 400 })
		)

		await expect(
			client.request(CREDENTIALS, EnumGreenMethod.CHECK_WHATSAPP, {
				httpMethod: 'POST',
				body: { phoneNumber: 123 }
			})
		).rejects.toEqual(
			new GreenApiError(
				400,
				'Некорректный запрос к GREEN-API: bad phone number, valid from 11 to 16 digits'
			)
		)
	})

	it('добавляет к сообщению причину из текстового ответа GREEN-API', async () => {
		const { client } = createClient(new Response('Validation failed', { status: 400 }))

		await expect(
			client.request(CREDENTIALS, EnumGreenMethod.SEND_MESSAGE, { httpMethod: 'POST', body: {} })
		).rejects.toMatchObject({ message: 'Некорректный запрос к GREEN-API: Validation failed' })
	})

	it('сетевую ошибку превращает в 502', async () => {
		const { client } = createClient(new Error('network'))

		await expect(
			client.request(CREDENTIALS, EnumGreenMethod.GET_STATE_INSTANCE, { httpMethod: 'GET' })
		).rejects.toMatchObject({ status: 502 })
	})
})
