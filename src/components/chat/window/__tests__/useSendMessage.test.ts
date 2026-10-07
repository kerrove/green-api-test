jest.mock('../../../../services/green-api.service', () => ({
	__esModule: true,
	default: { sendMessage: jest.fn() }
}))
jest.mock('react-hot-toast')

import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { createQueryWrapper } from 'tests/helpers/wrapper'

import greenApiService from '../../../../services/green-api.service'
import { useChatsStore } from '../../../../store/chats.store'
import { useSendMessage } from '../useSendMessage'

const sendMessage = jest.mocked(greenApiService.sendMessage)
const initialState = useChatsStore.getState()

const setup = () => {
	const { wrapper } = createQueryWrapper()
	return renderHook(() => useSendMessage('100'), { wrapper }).result
}

beforeEach(() => {
	useChatsStore.setState(initialState, true)
	useChatsStore.getState().upsertChat({ chatId: '100', title: 'Иван' })
})

describe('useSendMessage', () => {
	it('отправляет обрезанный текст и добавляет исходящее сообщение', async () => {
		sendMessage.mockResolvedValue({ idMessage: 'out-1' })
		const result = setup()

		let isSent = false
		await act(async () => {
			isSent = await result.current.send('  Привет  ')
		})

		expect(isSent).toBe(true)
		expect(sendMessage).toHaveBeenCalledWith('100', 'Привет')
		expect(useChatsStore.getState().chats['100'].messages).toEqual([
			expect.objectContaining({ id: 'out-1', text: 'Привет', direction: 'outgoing' })
		])
	})

	it('пустой текст не отправляет', async () => {
		const result = setup()

		await act(async () => {
			await result.current.send('   ')
		})

		expect(sendMessage).not.toHaveBeenCalled()
	})

	it('ошибку показывает тостом и не добавляет сообщение', async () => {
		sendMessage.mockRejectedValue(new Error('Лимит'))
		const result = setup()

		let isSent = true
		await act(async () => {
			isSent = await result.current.send('Привет')
		})

		expect(isSent).toBe(false)
		expect(toast.error).toHaveBeenCalledWith('Лимит')
		expect(useChatsStore.getState().chats['100'].messages).toEqual([])
	})
})
