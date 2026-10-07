import cn from 'clsx'
import * as m from 'framer-motion/m'
import type { FC } from 'react'

import { MESSAGE_ANIMATION_PROPS } from 'constants/animation.constants'

import { formatBubbleTime } from 'utils/format-message-time'

import { EnumMessageDirection, type IMessage } from 'types/chat.types'

interface Props {
	message: IMessage
}

export const MessageBubble: FC<Props> = ({ message }) => {
	const isOutgoing = message.direction === EnumMessageDirection.OUTGOING

	return (
		<m.li
			{...MESSAGE_ANIMATION_PROPS}
			data-direction={message.direction}
			className={cn('flex', isOutgoing ? 'justify-end' : 'justify-start')}
		>
			<div
				className={cn(
					'max-w-[min(30rem,85%)] rounded-xl px-2.5 pt-1.5 pb-1 text-[15px] leading-5',
					isOutgoing ? 'bg-bubble-out' : 'bg-bubble-in'
				)}
			>
				<p className='break-words whitespace-pre-wrap'>
					{message.text}
					<span
						aria-hidden
						className='inline-block w-12'
					/>
				</p>
				<time
					dateTime={new Date(message.timestamp).toISOString()}
					className='-mt-3.5 block text-right text-[11px] leading-4 text-text/55 tabular-nums'
				>
					{formatBubbleTime(message.timestamp)}
				</time>
			</div>
		</m.li>
	)
}
