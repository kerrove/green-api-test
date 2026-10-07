'use client'

import type { FC } from 'react'

import { MESSAGE_MAX_LENGTH } from 'constants/constants'

import { useChatsStore } from 'store/chats.store'

import type { IChat } from 'types/chat.types'

import { ChatHeader } from './ChatHeader'
import { MessageInput } from './MessageInput'
import { MessageList } from './MessageList'
import { useSendMessage } from './useSendMessage'

interface Props {
	chat: IChat
}

export const ChatWindow: FC<Props> = ({ chat }) => {
	const setActiveChat = useChatsStore(state => state.setActiveChat)
	const { send, isPending } = useSendMessage(chat.chatId)

	return (
		<div className='flex h-full min-h-0 flex-col'>
			<ChatHeader
				chat={chat}
				onBack={() => setActiveChat(null)}
			/>
			<div className='flex min-h-0 flex-1 flex-col bg-bg'>
				<MessageList messages={chat.messages} />
				<MessageInput
					onSend={send}
					isPending={isPending}
					maxLength={MESSAGE_MAX_LENGTH}
				/>
			</div>
		</div>
	)
}
