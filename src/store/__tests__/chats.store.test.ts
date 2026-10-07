import { useChatsStore } from '../chats.store'

import type { IChatEvent } from 'types/chat.types'

const initialState = useChatsStore.getState()

const event = (id: string, timestamp: number, chatId = '100'): IChatEvent => ({
	chatId,
	title: 'Иван',
	message: { id, text: `msg ${id}`, timestamp, direction: 'incoming' }
})

beforeEach(() => {
	useChatsStore.setState(initialState, true)
	localStorage.clear()
})

describe('chats.store', () => {
	it('upsertChat создаёт пустой чат', () => {
		useChatsStore.getState().upsertChat({ chatId: '100', title: '+7 999', phone: '7999' })

		expect(useChatsStore.getState().chats['100']).toMatchObject({
			chatId: '100',
			title: '+7 999',
			phone: '7999',
			messages: []
		})
	})

	it('upsertChat не теряет сообщения существующего чата', () => {
		const { addMessage, upsertChat } = useChatsStore.getState()
		addMessage(event('1', 1000))
		upsertChat({ chatId: '100', title: 'Новое имя' })

		const chat = useChatsStore.getState().chats['100']
		expect(chat.title).toBe('Новое имя')
		expect(chat.messages).toHaveLength(1)
	})

	it('addMessage автоматически создаёт чат для нового собеседника', () => {
		useChatsStore.getState().addMessage(event('1', 1000, '555'))

		expect(useChatsStore.getState().chats['555']).toMatchObject({ title: 'Иван', updatedAt: 1000 })
	})

	it('addMessage без title называет чат по chatId', () => {
		useChatsStore.getState().addMessage({ ...event('1', 1000, '555'), title: undefined })

		expect(useChatsStore.getState().chats['555'].title).toBe('555')
	})

	it('addMessage не дублирует сообщение с тем же id', () => {
		const { addMessage } = useChatsStore.getState()
		addMessage(event('1', 1000))
		addMessage(event('1', 2000))

		expect(useChatsStore.getState().chats['100'].messages).toHaveLength(1)
	})

	it('addMessage держит сообщения по времени и двигает updatedAt', () => {
		const { addMessage } = useChatsStore.getState()
		addMessage(event('2', 2000))
		addMessage(event('1', 1000))

		const chat = useChatsStore.getState().chats['100']
		expect(chat.messages.map(message => message.id)).toEqual(['1', '2'])
		expect(chat.updatedAt).toBe(2000)
	})

	it('syncOwner сбрасывает историю при смене инстанса', () => {
		const { syncOwner, addMessage } = useChatsStore.getState()
		syncOwner('A')
		addMessage(event('1', 1000))
		syncOwner('A')
		expect(Object.keys(useChatsStore.getState().chats)).toEqual(['100'])

		useChatsStore.getState().syncOwner('B')
		expect(useChatsStore.getState()).toMatchObject({ ownerId: 'B', chats: {}, activeChatId: null })
	})

	it('setActiveChat и reset', () => {
		useChatsStore.getState().setActiveChat('100')
		expect(useChatsStore.getState().activeChatId).toBe('100')

		useChatsStore.getState().reset()
		expect(useChatsStore.getState().activeChatId).toBeNull()
	})

	it('в localStorage сохраняются чаты, но не активный чат', () => {
		const { addMessage, setActiveChat } = useChatsStore.getState()
		addMessage(event('1', 1000))
		setActiveChat('100')

		const saved = JSON.parse(localStorage.getItem('chats-store') ?? '{}')
		expect(saved.state.chats['100']).toBeDefined()
		expect(saved.state.activeChatId).toBeUndefined()
	})
})
