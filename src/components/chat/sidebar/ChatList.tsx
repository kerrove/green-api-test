import type { FC } from 'react'

import type { IChat } from 'types/chat.types'

import { ChatListItem } from './ChatListItem'

interface Props {
	chats: IChat[]
	activeChatId: string | null
	onSelect: (chatId: string) => void
}

export const ChatList: FC<Props> = ({ chats, activeChatId, onSelect }) => {
	if (!chats.length) {
		return (
			<div className='px-5 pt-6 text-sm leading-6 text-muted'>
				<p className='font-medium text-text'>Чатов пока нет</p>
				<p className='mt-1'>
					Чтобы написать первым, нажмите <span className='font-semibold text-primary'>+</span> и
					введите номер телефона собеседника — человека, у которого есть WhatsApp.
				</p>
				<p className='mt-2'>Если вам напишут в WhatsApp, чат появится здесь сам.</p>
			</div>
		)
	}

	return (
		<ul
			aria-label='Список чатов'
			className='thin-scrollbar flex-1 overflow-y-auto'
		>
			{chats.map(chat => (
				<ChatListItem
					key={chat.chatId}
					chat={chat}
					isActive={chat.chatId === activeChatId}
					onSelect={onSelect}
				/>
			))}
		</ul>
	)
}
