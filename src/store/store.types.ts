import type { IChat, IChatEvent } from 'types/chat.types'

interface INewChat {
	chatId: string
	title: string
	phone?: string
}

export interface IChatsState {
	ownerId: string | null
	chats: Record<string, IChat>
	activeChatId: string | null
}

export interface IChatsStore extends IChatsState {
	syncOwner: (ownerId: string) => void
	upsertChat: (chat: INewChat) => void
	addMessage: (event: IChatEvent) => void
	setActiveChat: (chatId: string | null) => void
	reset: () => void
}
