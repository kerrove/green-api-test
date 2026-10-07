'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { type SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import authService from 'services/auth.service'

import { DEFAULT_API_URL } from 'constants/constants'

import { Pages } from 'config/pages/pages.config'
import { MutationKeys } from 'config/query/mutation-keys.config'

import { errorCatch } from 'api/api.helper'

import type { ILoginData } from 'types/auth.types'

import type { IHookForm } from '../form.types'

export function useLogin(): IHookForm<ILoginData> {
	const router = useRouter()

	const { mutateAsync, isPending } = useMutation({
		mutationKey: MutationKeys.LOGIN,
		mutationFn: (data: ILoginData) => authService.login(data)
	})

	const form = useForm<ILoginData>({
		mode: 'onChange',
		defaultValues: { apiUrl: DEFAULT_API_URL, idInstance: '', apiTokenInstance: '' }
	})

	const onSubmit: SubmitHandler<ILoginData> = data => {
		toast.promise(mutateAsync(data), {
			loading: 'Проверяем данные...',
			success: () => {
				router.replace(Pages.HOME)
				router.refresh()
				return 'Вход выполнен'
			},
			error: errorCatch
		})
	}

	return { form, onSubmit, isPending }
}
