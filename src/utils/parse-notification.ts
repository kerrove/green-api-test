import { EnumMessageDirection, type IChatEvent } from 'types/chat.types'
import {
	EnumTypeMessage,
	EnumTypeWebhook,
	type IMessageData,
	type INotificationBody
} from 'types/green-api.types'

const DIRECTION_BY_WEBHOOK: Partial<Record<string, EnumMessageDirection>> = {
	[EnumTypeWebhook.INCOMING_MESSAGE_RECEIVED]: EnumMessageDirection.INCOMING,
	[EnumTypeWebhook.OUTGOING_MESSAGE_RECEIVED]: EnumMessageDirection.OUTGOING,
	[EnumTypeWebhook.OUTGOING_API_MESSAGE_RECEIVED]: EnumMessageDirection.OUTGOING
}

const getText = (messageData?: IMessageData): string | null => {
	switch (messageData?.typeMessage) {
		case EnumTypeMessage.TEXT:
			return messageData.textMessageData?.textMessage ?? null
		case EnumTypeMessage.EXTENDED_TEXT:
		case EnumTypeMessage.QUOTED:
			return messageData.extendedTextMessageData?.text ?? null
		default:
			return null
	}
}

const GROUP_CHAT_SUFFIX = '@g.us'

const getTitle = (body: INotificationBody, direction: EnumMessageDirection) => {
	const sender = body.senderData
	const isGroup = sender?.chatId.endsWith(GROUP_CHAT_SUFFIX)
	if (direction === EnumMessageDirection.OUTGOING || isGroup) return sender?.chatName || undefined
	return sender?.senderContactName || sender?.senderName || sender?.chatName || undefined
}

export const parseNotification = (body: INotificationBody): IChatEvent | null => {
	const direction = DIRECTION_BY_WEBHOOK[body.typeWebhook]
	const chatId = body.senderData?.chatId
	const text = getText(body.messageData)

	if (!direction || !chatId || !body.idMessage || text === null) return null

	return {
		chatId,
		title: getTitle(body, direction),
		message: {
			id: body.idMessage,
			text,
			timestamp: body.timestamp * 1000,
			direction
		}
	}
}
