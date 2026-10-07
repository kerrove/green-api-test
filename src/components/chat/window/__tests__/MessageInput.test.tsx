import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { MessageInput } from '../MessageInput'

const renderInput = (onSend = jest.fn().mockResolvedValue(true), isPending = false) => {
	render(
		<MessageInput
			onSend={onSend}
			isPending={isPending}
			maxLength={4000}
		/>
	)
	return { onSend, textarea: screen.getByLabelText('Сообщение') }
}

describe('MessageInput', () => {
	it('ограничивает длину сообщения лимитом платформы', () => {
		const { textarea } = renderInput()

		expect(textarea).toHaveAttribute('maxLength', '4000')
	})

	it('кнопка отправки неактивна для пустого текста', () => {
		const { textarea } = renderInput()

		expect(screen.getByRole('button', { name: 'Отправить' })).toBeDisabled()
		fireEvent.change(textarea, { target: { value: '   ' } })
		expect(screen.getByRole('button', { name: 'Отправить' })).toBeDisabled()
	})

	it('Enter отправляет и очищает поле', async () => {
		const { onSend, textarea } = renderInput()

		fireEvent.change(textarea, { target: { value: 'Привет' } })
		fireEvent.keyDown(textarea, { key: 'Enter' })

		expect(onSend).toHaveBeenCalledWith('Привет')
		await waitFor(() => expect(textarea).toHaveValue(''))
	})

	it('Shift+Enter не отправляет', () => {
		const { onSend, textarea } = renderInput()

		fireEvent.change(textarea, { target: { value: 'Строка' } })
		fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })

		expect(onSend).not.toHaveBeenCalled()
	})

	it('кнопка отправляет сообщение', async () => {
		const { onSend, textarea } = renderInput()

		fireEvent.change(textarea, { target: { value: 'Кнопкой' } })
		fireEvent.click(screen.getByRole('button', { name: 'Отправить' }))

		expect(onSend).toHaveBeenCalledWith('Кнопкой')
		await waitFor(() => expect(textarea).toHaveValue(''))
	})

	it('при неудаче текст остаётся в поле', async () => {
		const { onSend, textarea } = renderInput(jest.fn().mockResolvedValue(false))

		fireEvent.change(textarea, { target: { value: 'Не ушло' } })
		fireEvent.keyDown(textarea, { key: 'Enter' })

		await waitFor(() => expect(onSend).toHaveBeenCalled())
		expect(textarea).toHaveValue('Не ушло')
	})

	it('во время отправки повторно не отправляет', () => {
		const { onSend, textarea } = renderInput(undefined, true)

		fireEvent.change(textarea, { target: { value: 'Дубль' } })
		fireEvent.keyDown(textarea, { key: 'Enter' })

		expect(onSend).not.toHaveBeenCalled()
	})
})
