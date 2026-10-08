jest.mock('../../../../services/instance.service', () => ({
	__esModule: true,
	default: { getReceivingStatus: jest.fn(), enableReceiving: jest.fn() }
}))
jest.mock('react-hot-toast')

import { fireEvent, screen, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { renderWrapper } from 'tests/helpers/wrapper'

import instanceService from '../../../../services/instance.service'
import { ReceivingBanner } from '../ReceivingBanner'

const getReceivingStatus = jest.mocked(instanceService.getReceivingStatus)
const enableReceiving = jest.mocked(instanceService.enableReceiving)

describe('ReceivingBanner', () => {
	it('ничего не показывает, если получать сообщения можно', async () => {
		getReceivingStatus.mockResolvedValue({
			canReceive: true,
			incomingEnabled: true,
			webhookUrlSet: false
		})

		const { container } = renderWrapper(<ReceivingBanner />)

		await waitFor(() => expect(getReceivingStatus).toHaveBeenCalled())
		expect(container).toBeEmptyDOMElement()
	})

	it('объясняет, что входящие выключены, и включает их по кнопке', async () => {
		getReceivingStatus.mockResolvedValue({
			canReceive: false,
			incomingEnabled: false,
			webhookUrlSet: false
		})
		enableReceiving.mockResolvedValue({ saveSettings: true })

		renderWrapper(<ReceivingBanner />)

		expect(await screen.findByRole('status')).toHaveTextContent(
			'Получение входящих выключено в настройках инстанса'
		)
		fireEvent.click(screen.getByRole('button', { name: 'Включить получение' }))

		await waitFor(() => expect(enableReceiving).toHaveBeenCalled())
		expect(toast.success).toHaveBeenCalledWith(
			'Настройки сохранены. GREEN-API применит их в течение 5 минут'
		)
		expect(await screen.findByText(/Настройки применяются/)).toBeInTheDocument()
	})

	it('предупреждает, что кнопка очистит заданный webhookUrl', async () => {
		getReceivingStatus.mockResolvedValue({
			canReceive: false,
			incomingEnabled: true,
			webhookUrlSet: true
		})

		renderWrapper(<ReceivingBanner />)

		expect(await screen.findByRole('status')).toHaveTextContent('webhookUrl')
		expect(screen.getByRole('button', { name: 'Очистить webhookUrl' })).toBeInTheDocument()
	})

	it('при ошибке сохранения показывает тост и оставляет кнопку', async () => {
		getReceivingStatus.mockResolvedValue({
			canReceive: false,
			incomingEnabled: false,
			webhookUrlSet: false
		})
		enableReceiving.mockRejectedValue(new Error('Слишком много запросов'))

		renderWrapper(<ReceivingBanner />)

		fireEvent.click(await screen.findByRole('button', { name: 'Включить получение' }))

		await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Слишком много запросов'))
		expect(screen.getByRole('button', { name: 'Включить получение' })).toBeEnabled()
	})
})
