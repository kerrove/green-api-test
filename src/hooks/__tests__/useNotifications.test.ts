jest.mock('../../services/green-api.service', () => ({
	__esModule: true,
	default: { receiveNotification: jest.fn(), deleteNotification: jest.fn() }
}))
jest.mock('react-hot-toast')

import { renderHook, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'

import greenApiService from '../../services/green-api.service'
import { useChatsStore } from '../../store/chats.store'
import { NOTIFICATIONS_ERROR_TOAST_ID, useNotifications } from '../useNotifications'

const receive = jest.mocked(greenApiService.receiveNotification)
const remove = jest.mocked(greenApiService.deleteNotification)

const initialState = useChatsStore.getState()

const NOTIFICATION = {
	receiptId: 9,
	body: {
		typeWebhook: 'incomingMessageReceived',
		timestamp: 1763115112,
		idMessage: 'in-1',
		senderData: { chatId: '777', senderName: 'Мария' },
		messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Привет!' } }
	}
}

const hang = () => new Promise<never>(() => {})

beforeEach(() => {
	useChatsStore.setState(initialState, true)
	remove.mockResolvedValue({ result: true })
})

describe('useNotifications', () => {
	it('кладёт входящее сообщение в стор и удаляет уведомление', async () => {
		receive.mockResolvedValueOnce(NOTIFICATION).mockImplementation(hang)

		renderHook(() => useNotifications())

		await waitFor(() => expect(remove).toHaveBeenCalledWith(9))
		expect(useChatsStore.getState().chats['777']).toMatchObject({
			title: 'Мария',
			messages: [{ id: 'in-1', text: 'Привет!', direction: 'incoming' }]
		})
	})

	it('нераспознанное уведомление тоже удаляет из очереди', async () => {
		receive
			.mockResolvedValueOnce({
				receiptId: 3,
				body: { typeWebhook: 'stateInstanceChanged', timestamp: 1 }
			})
			.mockImplementation(hang)

		renderHook(() => useNotifications())

		await waitFor(() => expect(remove).toHaveBeenCalledWith(3))
		expect(useChatsStore.getState().chats).toEqual({})
	})

	it('пустую очередь не удаляет и не долбит API повторно', async () => {
		receive.mockResolvedValue(null)

		renderHook(() => useNotifications())

		await waitFor(() => expect(receive).toHaveBeenCalledTimes(1))
		await new Promise(resolve => setTimeout(resolve, 50))
		expect(receive).toHaveBeenCalledTimes(1)
		expect(remove).not.toHaveBeenCalled()
	})

	it('ошибку показывает одним тостом', async () => {
		receive.mockRejectedValueOnce(new Error('Сеть недоступна')).mockImplementation(hang)

		renderHook(() => useNotifications())

		await waitFor(() =>
			expect(toast.error).toHaveBeenCalledWith('Не удалось получить сообщения: Сеть недоступна', {
				id: NOTIFICATIONS_ERROR_TOAST_ID
			})
		)
	})

	it('выключенный хук не опрашивает API', () => {
		renderHook(() => useNotifications(false))

		expect(receive).not.toHaveBeenCalled()
	})
})
