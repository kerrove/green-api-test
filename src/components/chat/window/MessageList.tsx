import { AnimatePresence } from 'framer-motion'
import { type FC, useEffect, useRef } from 'react'

import type { IMessage } from 'types/chat.types'

import { MessageBubble } from './MessageBubble'

interface Props {
	messages: IMessage[]
}

export const MessageList: FC<Props> = ({ messages }) => {
	const endRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		endRef.current?.scrollIntoView({ block: 'end' })
	}, [messages.length])

	return (
		<div className='thin-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-2'>
			{messages.length ? (
				<ul
					aria-label='Сообщения'
					aria-live='polite'
					className='mx-auto flex max-w-[52rem] flex-col gap-1'
				>
					<AnimatePresence initial={false}>
						{messages.map(message => (
							<MessageBubble
								key={message.id}
								message={message}
							/>
						))}
					</AnimatePresence>
				</ul>
			) : (
				<p className='mx-auto mt-6 w-fit rounded-full bg-black/35 px-3 py-1 text-[13px] text-text/80'>
					Сообщений пока нет. Напишите — собеседник получит его в WhatsApp
				</p>
			)}
			<div ref={endRef} />
		</div>
	)
}
