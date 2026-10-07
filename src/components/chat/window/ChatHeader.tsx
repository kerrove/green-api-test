import { ArrowLeft } from 'lucide-react'
import type { FC } from 'react'

import { Avatar } from 'ui/Avatar'
import { IconButton } from 'ui/IconButton'

import { formatPhone, getPhoneFromChatId } from 'utils/normalize-phone'

import type { IChat } from 'types/chat.types'

interface Props {
	chat: IChat
	onBack: () => void
}

export const ChatHeader: FC<Props> = ({ chat, onBack }) => {
	const phone = chat.phone ?? getPhoneFromChatId(chat.chatId)
	const subtitle = phone ? formatPhone(phone) : null

	return (
		<header className='flex h-16 shrink-0 items-center gap-3 border-b border-border bg-bg pr-4 pl-2'>
			<IconButton
				label='Назад к списку чатов'
				onClick={onBack}
			>
				<ArrowLeft size={22} />
			</IconButton>
			<Avatar
				seed={chat.chatId}
				title={chat.title}
				className='size-10 text-sm'
			/>
			<div className='min-w-0'>
				<h2 className='truncate text-[15px] leading-5 font-semibold'>{chat.title}</h2>
				{subtitle && subtitle !== chat.title && (
					<p className='truncate text-xs text-muted'>{subtitle}</p>
				)}
			</div>
		</header>
	)
}
