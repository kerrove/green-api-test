'use client'

import cn from 'clsx'
import type { FC } from 'react'

import { useChatsStore } from 'store/chats.store'

import { useChatsHydration } from 'hooks/useChatsHydration'
import { useNotifications } from 'hooks/useNotifications'

import { NavRail } from './NavRail'
import { Sidebar } from './sidebar/Sidebar'
import { ChatWindow } from './window/ChatWindow'
import { EmptyChat } from './window/EmptyChat'

interface Props {
	idInstance: string
}

export const ChatPage: FC<Props> = ({ idInstance }) => {
	const isHydrated = useChatsHydration(idInstance)
	const activeChat = useChatsStore(state =>
		state.activeChatId ? state.chats[state.activeChatId] : undefined
	)

	useNotifications(isHydrated)

	return (
		<main className='flex h-dvh overflow-hidden'>
			<NavRail idInstance={idInstance} />
			<div className='grid min-w-0 flex-1 grid-cols-[minmax(18rem,24rem)_1fr] md:grid-cols-1'>
				<div
					data-testid='chat-sidebar'
					className={cn('min-h-0', activeChat && 'md:hidden')}
				>
					<Sidebar />
				</div>
				<section
					data-testid='chat-window'
					aria-label={activeChat ? `Чат: ${activeChat.title}` : 'Чат не выбран'}
					className={cn('min-h-0 min-w-0', !activeChat && 'md:hidden')}
				>
					{activeChat ? (
						<ChatWindow
							key={activeChat.chatId}
							chat={activeChat}
						/>
					) : (
						<EmptyChat />
					)}
				</section>
			</div>
		</main>
	)
}
