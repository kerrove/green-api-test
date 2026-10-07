'use client'

import { type FC, useState } from 'react'

import { NewChatPanel } from 'forms/new-chat/NewChatPanel'

import { useChatsStore } from 'store/chats.store'

import { useSortedChats } from 'hooks/useSortedChats'

import { ChatList } from './ChatList'
import { SidebarHeader } from './SidebarHeader'

export const Sidebar: FC = () => {
	const [isCreating, setIsCreating] = useState(false)
	const chats = useSortedChats()
	const activeChatId = useChatsStore(state => state.activeChatId)
	const setActiveChat = useChatsStore(state => state.setActiveChat)

	return (
		<aside className='flex h-full flex-col border-r border-border bg-panel'>
			{isCreating ? (
				<NewChatPanel onClose={() => setIsCreating(false)} />
			) : (
				<>
					<SidebarHeader onCreateChat={() => setIsCreating(true)} />
					<ChatList
						chats={chats}
						activeChatId={activeChatId}
						onSelect={setActiveChat}
					/>
				</>
			)}
		</aside>
	)
}
