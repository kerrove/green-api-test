export const EnumGreenMethod = {
	GET_STATE_INSTANCE: 'getStateInstance',
	GET_SETTINGS: 'getSettings',
	CHECK_WHATSAPP: 'checkWhatsapp',
	SEND_MESSAGE: 'sendMessage',
	RECEIVE_NOTIFICATION: 'receiveNotification',
	DELETE_NOTIFICATION: 'deleteNotification'
} as const
export type EnumGreenMethod = (typeof EnumGreenMethod)[keyof typeof EnumGreenMethod]

export const EnumTypeWebhook = {
	INCOMING_MESSAGE_RECEIVED: 'incomingMessageReceived',
	OUTGOING_MESSAGE_RECEIVED: 'outgoingMessageReceived',
	OUTGOING_API_MESSAGE_RECEIVED: 'outgoingAPIMessageReceived',
	OUTGOING_MESSAGE_STATUS: 'outgoingMessageStatus',
	STATE_INSTANCE_CHANGED: 'stateInstanceChanged'
} as const
export type EnumTypeWebhook = (typeof EnumTypeWebhook)[keyof typeof EnumTypeWebhook]

export const EnumTypeMessage = {
	TEXT: 'textMessage',
	EXTENDED_TEXT: 'extendedTextMessage',
	QUOTED: 'quotedMessage'
} as const
export type EnumTypeMessage = (typeof EnumTypeMessage)[keyof typeof EnumTypeMessage]

export const EnumStateInstance = {
	AUTHORIZED: 'authorized',
	NOT_AUTHORIZED: 'notAuthorized',
	BLOCKED: 'blocked',
	STARTING: 'starting',
	SUSPENDED: 'suspended',
	PENDING_PASSWORD: 'pendingPassword'
} as const
export type EnumStateInstance = (typeof EnumStateInstance)[keyof typeof EnumStateInstance]

export interface IStateInstanceResponse {
	stateInstance: EnumStateInstance
}

export const WHATSAPP_TYPE_INSTANCE = 'whatsapp'

export interface ISettingsResponse {
	typeInstance?: string
	wid?: string
}

export interface ICheckWhatsappData {
	phoneNumber: number
}

export interface ICheckWhatsappResponse {
	existsWhatsapp: boolean
	chatId?: string
	phoneNumber?: string
}

export interface ISendMessageData {
	chatId: string
	message: string
}

export interface ISendMessageResponse {
	idMessage: string
}

export interface IDeleteNotificationResponse {
	result: boolean
	reason?: string
}

interface ISenderData {
	chatId: string
	chatName?: string
	sender?: string
	senderName?: string
	senderContactName?: string
	senderPhoneNumber?: number
}

export interface IMessageData {
	typeMessage: string
	textMessageData?: { textMessage: string }
	extendedTextMessageData?: { text: string }
}

export interface INotificationBody {
	typeWebhook: string
	timestamp: number
	idMessage?: string
	chatId?: string
	senderData?: ISenderData
	messageData?: IMessageData
}

interface INotification {
	receiptId: number
	body: INotificationBody
}

export type TReceiveNotificationResponse = INotification | null
