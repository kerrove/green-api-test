import { parseNotification } from '../parse-notification'

import type { INotificationBody } from 'types/green-api.types'

const SENDER = {
	chatId: '10000000',
	chatName: 'Чат с Иваном',
	sender: '10000000',
	senderName: 'Иван',
	senderContactName: 'Иван Петров'
}

const incoming = (messageData: INotificationBody['messageData']): INotificationBody => ({
	typeWebhook: 'incomingMessageReceived',
	timestamp: 1763115112,
	idMessage: 'id-1',
	senderData: SENDER,
	messageData
})

describe('parseNotification', () => {
	it('разбирает входящее textMessage', () => {
		const event = parseNotification(
			incoming({ typeMessage: 'textMessage', textMessageData: { textMessage: 'Привет' } })
		)

		expect(event).toEqual({
			chatId: '10000000',
			title: 'Иван Петров',
			message: {
				id: 'id-1',
				text: 'Привет',
				timestamp: 1763115112000,
				direction: 'incoming'
			}
		})
	})

	it('разбирает extendedTextMessage со ссылкой', () => {
		const event = parseNotification(
			incoming({
				typeMessage: 'extendedTextMessage',
				extendedTextMessageData: { text: 'Смотри https://green-api.com' }
			})
		)

		expect(event?.message.text).toBe('Смотри https://green-api.com')
	})

	it('разбирает ответ-цитату WhatsApp (quotedMessage)', () => {
		const event = parseNotification(
			incoming({
				typeMessage: 'quotedMessage',
				extendedTextMessageData: { text: 'Да, согласен' }
			})
		)

		expect(event?.message.text).toBe('Да, согласен')
	})

	it('в группе WhatsApp называет чат по имени группы', () => {
		const event = parseNotification({
			...incoming({ typeMessage: 'textMessage', textMessageData: { textMessage: 'Всем привет' } }),
			senderData: {
				chatId: '120363043968066561@g.us',
				chatName: 'Семья',
				senderName: 'Мама'
			}
		})

		expect(event).toMatchObject({ chatId: '120363043968066561@g.us', title: 'Семья' })
	})

	it('берёт senderName, если нет имени контакта', () => {
		const event = parseNotification({
			...incoming({ typeMessage: 'textMessage', textMessageData: { textMessage: 'a' } }),
			senderData: { chatId: '1', senderName: 'Мария' }
		})

		expect(event?.title).toBe('Мария')
	})

	it.each(['outgoingMessageReceived', 'outgoingAPIMessageReceived'])(
		'%s считает исходящим',
		typeWebhook => {
			const event = parseNotification({
				...incoming({ typeMessage: 'textMessage', textMessageData: { textMessage: 'Ответ' } }),
				typeWebhook
			})

			expect(event?.message.direction).toBe('outgoing')
			expect(event?.title).toBe('Чат с Иваном')
		}
	)

	it('игнорирует нетекстовые сообщения', () => {
		expect(parseNotification(incoming({ typeMessage: 'imageMessage' }))).toBeNull()
	})

	it('игнорирует статусы и прочие уведомления', () => {
		expect(
			parseNotification({
				typeWebhook: 'outgoingMessageStatus',
				timestamp: 1,
				idMessage: 'x',
				chatId: '1'
			})
		).toBeNull()
		expect(parseNotification({ typeWebhook: 'stateInstanceChanged', timestamp: 1 })).toBeNull()
	})

	it('пустой текст тоже сообщение', () => {
		const event = parseNotification(
			incoming({ typeMessage: 'textMessage', textMessageData: { textMessage: '' } })
		)

		expect(event?.message.text).toBe('')
	})
})
