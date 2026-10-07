import { fireEvent, screen } from '@testing-library/react'
import { renderWrapper } from 'tests/helpers/wrapper'

import { ChatList } from '../sidebar/ChatList'
import { MessageBubble } from '../window/MessageBubble'

import type { IChat } from 'types/chat.types'

const CHATS: IChat[] = [
	{
		chatId: '1',
		title: 'Иван Петров',
		messages: [{ id: 'a', text: 'Привет!', timestamp: Date.now(), direction: 'incoming' }],
		updatedAt: Date.now()
	},
	{
		chatId: '2',
		title: '+7 999 123-45-67',
		messages: [{ id: 'b', text: 'Ответ', timestamp: Date.now(), direction: 'outgoing' }],
		updatedAt: Date.now()
	},
	{ chatId: '3', title: 'Пустой', messages: [], updatedAt: Date.now() }
]

describe('ChatList', () => {
	it('показывает подсказку, когда чатов нет', () => {
		renderWrapper(
			<ChatList
				chats={[]}
				activeChatId={null}
				onSelect={jest.fn()}
			/>
		)

		expect(screen.getByText('Чатов пока нет')).toBeInTheDocument()
	})

	it('рендерит чаты с последним сообщением и отмечает активный', () => {
		renderWrapper(
			<ChatList
				chats={CHATS}
				activeChatId='2'
				onSelect={jest.fn()}
			/>
		)

		expect(screen.getAllByRole('listitem')).toHaveLength(3)
		expect(screen.getByText('Привет!')).toBeInTheDocument()
		expect(screen.getByText('Ответ').parentElement).toHaveTextContent('Вы: Ответ')
		expect(screen.getByText('Нет сообщений')).toBeInTheDocument()
		expect(screen.getByRole('button', { current: true })).toHaveTextContent('+7 999 123-45-67')
	})

	it('по клику выбирает чат', () => {
		const onSelect = jest.fn()
		renderWrapper(
			<ChatList
				chats={CHATS}
				activeChatId={null}
				onSelect={onSelect}
			/>
		)

		fireEvent.click(screen.getByRole('button', { name: /Иван Петров/ }))

		expect(onSelect).toHaveBeenCalledWith('1')
	})
})

describe('MessageBubble', () => {
	it.each([
		['incoming', 'justify-start'],
		['outgoing', 'justify-end']
	] as const)('%s выравнивается классом %s', (direction, className) => {
		renderWrapper(
			<ul>
				<MessageBubble message={{ id: '1', text: 'Текст', timestamp: Date.now(), direction }} />
			</ul>
		)

		const item = screen.getByRole('listitem')
		expect(item).toHaveAttribute('data-direction', direction)
		expect(item).toHaveClass(className)
		expect(item).toHaveTextContent('Текст')
	})
})
