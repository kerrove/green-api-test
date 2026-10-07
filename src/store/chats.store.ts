import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { IChat } from 'types/chat.types'

import { initialChatsState } from './initial-data.store'
import type { IChatsStore } from './store.types'

export const useChatsStore = create<IChatsStore>()(
	persist(
		set => ({
			...initialChatsState,
			syncOwner: ownerId =>
				set(state => (state.ownerId === ownerId ? state : { ...initialChatsState, ownerId })),
			upsertChat: ({ chatId, title, phone }) =>
				set(state => {
					const existing = state.chats[chatId]
					const chat: IChat = existing
						? { ...existing, title, phone: phone ?? existing.phone }
						: { chatId, title, phone, messages: [], updatedAt: Date.now() }
					return { chats: { ...state.chats, [chatId]: chat } }
				}),
			addMessage: ({ chatId, title, message }) =>
				set(state => {
					const existing = state.chats[chatId]
					if (existing?.messages.some(item => item.id === message.id)) return state

					const chat: IChat = existing ?? {
						chatId,
						title: title || chatId,
						messages: [],
						updatedAt: message.timestamp
					}
					const messages = [...chat.messages, message].sort((a, b) => a.timestamp - b.timestamp)

					return {
						chats: {
							...state.chats,
							[chatId]: {
								...chat,
								messages,
								updatedAt: Math.max(chat.updatedAt, message.timestamp)
							}
						}
					}
				}),
			setActiveChat: activeChatId => set({ activeChatId }),
			reset: () => set(initialChatsState)
		}),
		{
			name: 'chats-store',
			skipHydration: true,
			partialize: ({ ownerId, chats }) => ({ ownerId, chats })
		}
	)
)
