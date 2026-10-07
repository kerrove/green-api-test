jest.mock('../../../../services/green-api.service', () => ({
	__esModule: true,
	default: { checkWhatsapp: jest.fn() }
}))
jest.mock('react-hot-toast')

import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWrapper } from 'tests/helpers/wrapper'

import greenApiService from '../../../../services/green-api.service'
import { useChatsStore } from '../../../../store/chats.store'
import { NewChatPanel } from '../NewChatPanel'
import { INVALID_PHONE_ERROR } from '../useCreateChat'

const checkWhatsapp = jest.mocked(greenApiService.checkWhatsapp)
const initialState = useChatsStore.getState()

const renderPanel = () => {
	const onClose = jest.fn()
	renderWrapper(<NewChatPanel onClose={onClose} />)
	return { onClose }
}

const submitPhone = (phone: string) => {
	fireEvent.change(screen.getByLabelText('Номер телефона собеседника'), {
		target: { value: phone }
	})
	fireEvent.click(screen.getByRole('button', { name: 'Открыть чат' }))
}

beforeEach(() => {
	useChatsStore.setState(initialState, true)
})

describe('NewChatPanel + useCreateChat', () => {
	it('проверяет номер через checkWhatsapp и открывает чат номер@c.us', async () => {
		checkWhatsapp.mockResolvedValue({ existsWhatsapp: true, chatId: '123456789012345@lid' })
		const { onClose } = renderPanel()

		submitPhone('8 (999) 123-45-67')

		await waitFor(() => expect(onClose).toHaveBeenCalled())
		expect(checkWhatsapp).toHaveBeenCalledWith('79991234567')
		expect(useChatsStore.getState()).toMatchObject({
			activeChatId: '79991234567@c.us',
			chats: { '79991234567@c.us': { title: '+7 999 123-45-67', phone: '79991234567' } }
		})
	})

	it('принимает номера любых стран', async () => {
		checkWhatsapp.mockResolvedValue({ existsWhatsapp: true })
		const { onClose } = renderPanel()

		submitPhone('+44 7911 123456')

		await waitFor(() => expect(onClose).toHaveBeenCalled())
		expect(useChatsStore.getState().activeChatId).toBe('447911123456@c.us')
	})

	it('если у номера нет WhatsApp, чат не создаётся', async () => {
		checkWhatsapp.mockResolvedValue({ existsWhatsapp: false })
		const { onClose } = renderPanel()

		submitPhone('+7 999 123-45-67')

		await waitFor(() => expect(checkWhatsapp).toHaveBeenCalled())
		expect(useChatsStore.getState().chats).toEqual({})
		expect(onClose).not.toHaveBeenCalled()
	})

	it('пустой номер не отправляется', async () => {
		renderPanel()

		fireEvent.click(screen.getByRole('button', { name: 'Открыть чат' }))

		expect(await screen.findByRole('alert')).toHaveTextContent('Введите номер телефона')
		expect(checkWhatsapp).not.toHaveBeenCalled()
	})

	it('слишком короткий номер отклоняет без запроса', async () => {
		renderPanel()

		submitPhone('+44 7911 12')

		expect(await screen.findByRole('alert')).toHaveTextContent(INVALID_PHONE_ERROR)
		expect(checkWhatsapp).not.toHaveBeenCalled()
	})

	it('закрывается по Escape и кнопкой «назад»', () => {
		const { onClose } = renderPanel()

		fireEvent.keyDown(document, { key: 'Escape' })
		fireEvent.click(screen.getByRole('button', { name: 'Назад к чатам' }))

		expect(onClose).toHaveBeenCalledTimes(2)
	})
})
