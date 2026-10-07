import { useChatsStore } from 'store/chats.store'

export function useSortedChats() {
	const chats = useChatsStore(state => state.chats)

	return Object.values(chats).sort((a, b) => b.updatedAt - a.updatedAt)
}
