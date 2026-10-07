import type { IChatsState } from './store.types'

export const initialChatsState: IChatsState = {
	ownerId: null,
	chats: {},
	activeChatId: null
}
