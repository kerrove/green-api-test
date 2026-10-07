'use client'

import type { FC } from 'react'

import { Button } from 'ui/Button'
import { Field } from 'ui/Field'

import { API_URL_PATTERN, ID_INSTANCE_PATTERN } from 'utils/validators/fields.validator'

import type { ILoginData } from 'types/auth.types'

import type { IHookForm } from '../form.types'

interface Props {
	hook: IHookForm<ILoginData>
}

const REQUIRED = 'Обязательное поле'

const trim = (value: unknown) => (typeof value === 'string' ? value.trim() : value)

export const LoginForm: FC<Props> = ({
	hook: {
		form: {
			handleSubmit,
			register,
			formState: { errors }
		},
		isPending,
		onSubmit
	}
}) => {
	return (
		<form
			noValidate
			onSubmit={handleSubmit(onSubmit)}
			className='flex flex-col gap-4'
		>
			<Field
				label='apiUrl'
				placeholder='https://1234.api.greenapi.com'
				inputMode='url'
				autoComplete='off'
				hint='Адрес API вашего инстанса, например https://7103.api.greenapi.com'
				registration={register('apiUrl', {
					required: REQUIRED,
					pattern: API_URL_PATTERN,
					setValueAs: trim
				})}
				error={errors.apiUrl?.message}
			/>
			<Field
				label='idInstance'
				placeholder='7103123456'
				inputMode='numeric'
				autoComplete='username'
				hint='Номер инстанса — только цифры'
				registration={register('idInstance', {
					required: REQUIRED,
					pattern: ID_INSTANCE_PATTERN,
					setValueAs: trim
				})}
				error={errors.idInstance?.message}
			/>
			<Field
				label='apiTokenInstance'
				type='password'
				autoComplete='current-password'
				hint='Секретный ключ инстанса. Хранится в защищённой cookie, скрипты страницы его не видят'
				registration={register('apiTokenInstance', { required: REQUIRED, setValueAs: trim })}
				error={errors.apiTokenInstance?.message}
			/>
			<Button
				type='submit'
				disabled={isPending}
				className='mt-2'
			>
				{isPending ? 'Проверяем инстанс…' : 'Войти'}
			</Button>
		</form>
	)
}
