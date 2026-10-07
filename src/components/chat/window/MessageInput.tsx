import cn from 'clsx'
import { SendHorizontal } from 'lucide-react'
import { type FC, type FormEvent, type KeyboardEvent, useState } from 'react'

interface Props {
	onSend: (text: string) => Promise<boolean>
	isPending: boolean
	maxLength: number
}

export const MessageInput: FC<Props> = ({ onSend, isPending, maxLength }) => {
	const [text, setText] = useState('')
	const canSend = !!text.trim() && !isPending

	const submit = async () => {
		if (!canSend) return
		const isSent = await onSend(text)
		if (isSent) setText('')
	}

	const onSubmit = (event: FormEvent) => {
		event.preventDefault()
		submit()
	}

	const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
			event.preventDefault()
			submit()
		}
	}

	return (
		<form
			onSubmit={onSubmit}
			className='shrink-0 px-4 pt-1 pb-4'
		>
			<div className='mx-auto flex max-w-[52rem] items-end rounded-xl bg-panel pl-4 shadow-[0_2px_10px_rgb(0_0_0/0.25)]'>
				<textarea
					value={text}
					onChange={event => setText(event.target.value)}
					onKeyDown={onKeyDown}
					rows={1}
					maxLength={maxLength}
					placeholder='Сообщение'
					aria-label='Сообщение'
					className='field-sizing-content thin-scrollbar max-h-40 min-h-12 flex-1 resize-none bg-transparent py-3.5 text-[15px] leading-5 text-text placeholder:text-muted focus-visible:outline-none'
				/>
				<button
					type='submit'
					aria-label='Отправить'
					title='Отправить (Enter)'
					disabled={!canSend}
					className={cn(
						'flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-150',
						canSend ? 'cursor-pointer text-primary hover:text-primary-hover' : 'text-muted/60'
					)}
				>
					<SendHorizontal
						size={22}
						strokeWidth={2}
					/>
				</button>
			</div>
		</form>
	)
}
