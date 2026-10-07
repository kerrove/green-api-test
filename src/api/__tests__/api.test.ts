import { AxiosError, AxiosHeaders } from 'axios'

import { errorCatch } from '../api.helper'
import { createUnauthorizedHandler } from '../axios'

const axiosError = (status: number, data?: unknown) =>
	new AxiosError('Request failed', 'ERR', undefined, undefined, {
		status,
		data,
		statusText: '',
		headers: {},
		config: { headers: new AxiosHeaders() }
	})

describe('errorCatch', () => {
	it('берёт message из ответа прокси', () => {
		expect(errorCatch(axiosError(400, { message: 'Номер не найден' }))).toBe('Номер не найден')
	})

	it('без тела берёт сообщение axios', () => {
		expect(errorCatch(axiosError(500))).toBe('Request failed')
	})

	it('строку и Error возвращает как есть', () => {
		expect(errorCatch('Ошибка')).toBe('Ошибка')
		expect(errorCatch(new Error('Сломалось'))).toBe('Сломалось')
	})

	it('неизвестное значение превращает в общее сообщение', () => {
		expect(errorCatch(undefined)).toBe('Что-то пошло не так')
	})
})

describe('createUnauthorizedHandler', () => {
	const navigate = jest.fn()
	const handler = createUnauthorizedHandler(navigate)

	it('на 401 уводит на /logout и пробрасывает ошибку', async () => {
		const error = axiosError(401)

		await expect(handler(error)).rejects.toBe(error)
		expect(navigate).toHaveBeenCalledWith('/logout')
	})

	it('прочие ошибки только пробрасывает', async () => {
		await expect(handler(axiosError(500))).rejects.toBeInstanceOf(AxiosError)
		expect(navigate).not.toHaveBeenCalled()
	})
})
