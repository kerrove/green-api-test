'use client'

import { ArrowLeft } from 'lucide-react'
import { type FC, useEffect } from 'react'

import { Button } from 'ui/Button'
import { Field } from 'ui/Field'
import { IconButton } from 'ui/IconButton'

import { useCreateChat } from './useCreateChat'

interface Props {
	onClose: () => void
}

export const NewChatPanel: FC<Props> = ({ onClose }) => {
	const {
		form: {
			handleSubmit,
			register,
			formState: { errors }
		},
		isPending,
		onSubmit
	} = useCreateChat(onClose)

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		}
		document.addEventListener('keydown', onKeyDown)
		return () => document.removeEventListener('keydown', onKeyDown)
	}, [onClose])

	return (
		<section
			aria-labelledby='new-chat-title'
			className='flex flex-1 flex-col'
		>
			<header className='flex h-16 shrink-0 items-center gap-2 px-2'>
				<IconButton
					label='Назад к чатам'
					onClick={onClose}
				>
					<ArrowLeft size={22} />
				</IconButton>
				<h2
					id='new-chat-title'
					className='text-lg font-semibold'
				>
					Новый чат
				</h2>
			</header>
			<form
				noValidate
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col gap-4 px-5 pt-2'
			>
				<Field
					label='Номер телефона собеседника'
					type='tel'
					inputMode='tel'
					autoComplete='tel'
					autoFocus
					placeholder='+7 999 123-45-67'
					hint='Номер с кодом страны, на который у собеседника зарегистрирован WhatsApp. Сообщения уйдут ему от вашего аккаунта'
					registration={register('phone', { required: 'Введите номер телефона' })}
					error={errors.phone?.message}
				/>
				<Button
					type='submit'
					disabled={isPending}
				>
					{isPending ? 'Ищем номер в WhatsApp…' : 'Открыть чат'}
				</Button>
			</form>
		</section>
	)
}
