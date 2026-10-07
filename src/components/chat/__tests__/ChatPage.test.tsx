jest.mock('../../../services/green-api.service', () => ({
	__esModule: true,
	default: {
		receiveNotification: jest.fn(() => new Promise(() => {})),
		deleteNotification: jest.fn(),
		sendMessage: jest.fn()
	}
}))
jest.mock('react-hot-toast')

import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWrapper } from 'tests/helpers/wrapper'

import greenApiService from '../../../services/green-api.service'
import { useChatsStore } from '../../../store/chats.store'
import { ChatPage } from '../ChatPage'

const initialState = useChatsStore.getState()

const seedChat = () =>
	act(() => {
		useChatsStore.getState().addMessage({
			chatId: '100',
			title: 'Иван',
			message: { id: '1', text: 'Привет', timestamp: Date.now(), direction: 'incoming' }
		})
	})

beforeEach(() => {
	useChatsStore.setState(initialState, true)
	localStorage.clear()
})

describe('ChatPage', () => {
	it('после гидрации начинает опрашивать уведомления', async () => {
		renderWrapper(<ChatPage idInstance='1101000001' />)

		await waitFor(() => expect(greenApiService.receiveNotification).toHaveBeenCalled())
		expect(useChatsStore.getState().ownerId).toBe('1101000001')
	})

	it('без активного чата показывает заглушку, а на мобилке — только список', async () => {
		renderWrapper(<ChatPage idInstance='1101000001' />)

		expect(screen.getByText(/^Выберите чат слева/)).toBeInTheDocument()
		expect(screen.getByTestId('chat-window')).toHaveClass('md:hidden')
		expect(screen.getByTestId('chat-sidebar')).not.toHaveClass('md:hidden')
		await waitFor(() => expect(useChatsStore.getState().ownerId).toBe('1101000001'))
	})

	it('выбор чата открывает окно, «назад» возвращает к списку', async () => {
		renderWrapper(<ChatPage idInstance='1101000001' />)
		await waitFor(() => expect(useChatsStore.getState().ownerId).toBe('1101000001'))
		seedChat()

		fireEvent.click(screen.getByRole('button', { name: /Иван/ }))

		expect(await screen.findByRole('heading', { name: 'Иван' })).toBeInTheDocument()
		expect(screen.getByTestId('chat-sidebar')).toHaveClass('md:hidden')
		expect(screen.getByTestId('chat-window')).not.toHaveClass('md:hidden')

		fireEvent.click(screen.getByRole('button', { name: 'Назад к списку чатов' }))

		expect(useChatsStore.getState().activeChatId).toBeNull()
		expect(screen.getByTestId('chat-sidebar')).not.toHaveClass('md:hidden')
	})

	it('кнопка «+» открывает панель нового чата вместо списка', async () => {
		renderWrapper(<ChatPage idInstance='1101000001' />)

		fireEvent.click(screen.getByRole('button', { name: 'Новый чат' }))

		expect(screen.getByRole('region', { name: 'Новый чат' })).toBeInTheDocument()
		expect(screen.getByLabelText('Номер телефона собеседника')).toHaveFocus()
		await waitFor(() => expect(useChatsStore.getState().ownerId).toBe('1101000001'))
	})

	it('рейл ведёт на выход и подписывает инстанс', async () => {
		renderWrapper(<ChatPage idInstance='1101000001' />)

		const nav = screen.getByRole('navigation', { name: 'Основная навигация' })
		expect(nav.querySelector('a[href="/logout"]')).toHaveAttribute(
			'title',
			'Выйти из инстанса 1101000001'
		)
		await waitFor(() => expect(useChatsStore.getState().ownerId).toBe('1101000001'))
	})
})
