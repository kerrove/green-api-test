import cn from 'clsx'
import type { FC } from 'react'

import { Avatar } from 'ui/Avatar'

import { formatMessageTime } from 'utils/format-message-time'

import { EnumMessageDirection, type IChat } from 'types/chat.types'

interface Props {
	chat: IChat
	isActive: boolean
	onSelect: (chatId: string) => void
}

export const ChatListItem: FC<Props> = ({ chat, isActive, onSelect }) => {
	const lastMessage = chat.messages.at(-1)

	return (
		<li>
			<button
				type='button'
				onClick={() => onSelect(chat.chatId)}
				aria-current={isActive || undefined}
				className={cn(
					'flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100',
					isActive ? 'bg-panel-active' : 'hover:bg-panel-hover'
				)}
			>
				<Avatar
					seed={chat.chatId}
					title={chat.title}
				/>
				<span className='flex min-w-0 flex-1 flex-col gap-0.5'>
					<span className='flex items-baseline justify-between gap-2'>
						<span className='truncate text-[15px] font-semibold'>{chat.title}</span>
						<span className='shrink-0 text-xs text-muted tabular-nums'>
							{formatMessageTime(lastMessage?.timestamp ?? chat.updatedAt)}
						</span>
					</span>
					<span className='line-clamp-2 text-sm leading-5 wrap-anywhere text-muted'>
						{lastMessage ? (
							<>
								{lastMessage.direction === EnumMessageDirection.OUTGOING && (
									<span className='text-text'>Вы: </span>
								)}
								{lastMessage.text}
							</>
						) : (
							'Нет сообщений'
						)}
					</span>
				</span>
			</button>
		</li>
	)
}
