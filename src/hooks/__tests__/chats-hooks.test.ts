import { act, renderHook, waitFor } from '@testing-library/react'

import { useChatsStore } from '../../store/chats.store'
import { useChatsHydration } from '../useChatsHydration'
import { useSortedChats } from '../useSortedChats'

const initialState = useChatsStore.getState()

beforeEach(() => {
	useChatsStore.setState(initialState, true)
	localStorage.clear()
})

describe('useSortedChats', () => {
	it('сортирует чаты по последней активности', () => {
		const { result } = renderHook(() => useSortedChats())

		act(() => {
			const { addMessage } = useChatsStore.getState()
			addMessage({
				chatId: 'old',
				message: { id: '1', text: 'a', timestamp: 1000, direction: 'incoming' }
			})
			addMessage({
				chatId: 'new',
				message: { id: '2', text: 'b', timestamp: 5000, direction: 'incoming' }
			})
		})

		expect(result.current.map(chat => chat.chatId)).toEqual(['new', 'old'])
	})
})

describe('useChatsHydration', () => {
	const persist = (ownerId: string) =>
		localStorage.setItem(
			'chats-store',
			JSON.stringify({
				state: {
					ownerId,
					chats: { '1': { chatId: '1', title: 'Сохранённый', messages: [], updatedAt: 1 } }
				},
				version: 0
			})
		)

	it('восстанавливает историю того же инстанса', async () => {
		persist('A')

		const { result } = renderHook(() => useChatsHydration('A'))

		await waitFor(() => expect(result.current).toBe(true))
		expect(useChatsStore.getState().chats['1'].title).toBe('Сохранённый')
	})

	it('сбрасывает историю другого инстанса', async () => {
		persist('A')

		const { result } = renderHook(() => useChatsHydration('B'))

		await waitFor(() => expect(result.current).toBe(true))
		expect(useChatsStore.getState()).toMatchObject({ ownerId: 'B', chats: {} })
	})
})
