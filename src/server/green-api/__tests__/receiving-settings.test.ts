import { ENABLE_RECEIVING_SETTINGS, toReceivingStatus } from '../receiving-settings'

describe('toReceivingStatus', () => {
	it('новый инстанс с выключенными уведомлениями не может получать сообщения', () => {
		expect(toReceivingStatus({ incomingWebhook: 'no', webhookUrl: '' })).toEqual({
			canReceive: false,
			incomingEnabled: false,
			webhookUrlSet: false
		})
	})

	it('включённые входящие и пустой webhookUrl — всё в порядке', () => {
		expect(toReceivingStatus({ incomingWebhook: 'yes', webhookUrl: '' })).toEqual({
			canReceive: true,
			incomingEnabled: true,
			webhookUrlSet: false
		})
	})

	it('заданный webhookUrl мешает получению через HTTP API', () => {
		expect(
			toReceivingStatus({ incomingWebhook: 'yes', webhookUrl: 'https://example.com/hook' })
		).toMatchObject({ canReceive: false, webhookUrlSet: true })
	})

	it('отсутствующие поля считает выключенными', () => {
		expect(toReceivingStatus({})).toMatchObject({ canReceive: false, incomingEnabled: false })
		expect(toReceivingStatus(null)).toMatchObject({ canReceive: false, incomingEnabled: false })
	})
})

describe('ENABLE_RECEIVING_SETTINGS', () => {
	it('включает входящие и очищает webhookUrl', () => {
		expect(ENABLE_RECEIVING_SETTINGS).toEqual({ incomingWebhook: 'yes', webhookUrl: '' })
	})
})
