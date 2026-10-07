import { GREEN_METHODS, isProxyMethod } from '../green-methods.config'

describe('green-methods.config', () => {
	it('пропускает только методы из реестра', () => {
		expect(isProxyMethod('sendMessage')).toBe(true)
		expect(isProxyMethod('receiveNotification')).toBe(true)
		expect(isProxyMethod('checkWhatsapp')).toBe(true)
		expect(isProxyMethod('getStateInstance')).toBe(false)
		expect(isProxyMethod('getSettings')).toBe(false)
		expect(isProxyMethod('logout')).toBe(false)
		expect(isProxyMethod('toString')).toBe(false)
	})

	it('deleteNotification требует id', () => {
		expect(GREEN_METHODS.deleteNotification).toEqual({ httpMethod: 'DELETE', withId: true })
	})
})
