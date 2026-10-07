export const EnumMessageDirection = {
	INCOMING: 'incoming',
	OUTGOING: 'outgoing'
} as const
export type EnumMessageDirection = (typeof EnumMessageDirection)[keyof typeof EnumMessageDirection]

export interface IMessage {
	id: string
	text: string
	timestamp: number
	direction: EnumMessageDirection
}

export interface IChat {
	chatId: string
	title: string
	phone?: string
	messages: IMessage[]
	updatedAt: number
}

export interface IChatEvent {
	chatId: string
	title?: string
	message: IMessage
}
