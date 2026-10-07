jest.mock('../../api/axios', () => ({
	httpCli: { post: jest.fn() },
	httpCliAuth: { get: jest.fn(), post: jest.fn(), delete: jest.fn() }
}))

import { httpCli, httpCliAuth } from '../../api/axios'
import authService from '../auth.service'
import greenApiService from '../green-api.service'

const http = jest.mocked(httpCliAuth)
const httpPublic = jest.mocked(httpCli)

describe('greenApiService', () => {
	it('checkWhatsapp шлёт номер числом в поле phoneNumber', async () => {
		http.post.mockResolvedValue({ data: { existsWhatsapp: true } })

		await expect(greenApiService.checkWhatsapp('79991234567')).resolves.toEqual({
			existsWhatsapp: true
		})
		expect(http.post).toHaveBeenCalledWith('/green/checkWhatsapp', { phoneNumber: 79991234567 })
	})

	it('sendMessage шлёт chatId и текст', async () => {
		http.post.mockResolvedValue({ data: { idMessage: 'm1' } })

		await expect(greenApiService.sendMessage('1', 'Привет')).resolves.toEqual({
			idMessage: 'm1'
		})
		expect(http.post).toHaveBeenCalledWith('/green/sendMessage', { chatId: '1', message: 'Привет' })
	})

	it('receiveNotification пробрасывает signal и возвращает уведомление', async () => {
		const notification = { receiptId: 5, body: { typeWebhook: 'x', timestamp: 1 } }
		http.get.mockResolvedValue({ data: notification })
		const signal = new AbortController().signal

		await expect(greenApiService.receiveNotification(signal)).resolves.toEqual(notification)
		expect(http.get).toHaveBeenCalledWith('/green/receiveNotification', { signal })
	})

	it.each([null, '', {}])('receiveNotification на пустой ответ (%p) отдаёт null', async data => {
		http.get.mockResolvedValue({ data })

		await expect(greenApiService.receiveNotification()).resolves.toBeNull()
	})

	it('deleteNotification передаёт receiptId в query', async () => {
		http.delete.mockResolvedValue({ data: { result: true } })

		await greenApiService.deleteNotification(5)
		expect(http.delete).toHaveBeenCalledWith('/green/deleteNotification', { params: { id: 5 } })
	})
})

describe('authService', () => {
	it('login отправляет данные формы', async () => {
		const data = { idInstance: '1', apiTokenInstance: 't', apiUrl: 'https://api.green-api.com' }
		httpPublic.post.mockResolvedValue({ data: { idInstance: '1' } })

		await expect(authService.login(data)).resolves.toEqual({ idInstance: '1' })
		expect(httpPublic.post).toHaveBeenCalledWith('/auth/login', data)
	})
})
