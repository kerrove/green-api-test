'use client'

import { useMutation } from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import greenApiService from 'services/green-api.service'

import { MutationKeys } from 'config/query/mutation-keys.config'

import { useChatsStore } from 'store/chats.store'

import { formatPhone, normalizePhone, toChatId } from 'utils/normalize-phone'

import { errorCatch } from 'api/api.helper'

import type { IHookForm } from '../form.types'

export interface INewChatForm {
	phone: string
}

export const INVALID_PHONE_ERROR =
	'Введите номер с кодом страны: от 11 до 16 цифр, например +7 999 123-45-67'
const NOT_IN_WHATSAPP_ERROR =
	'У этого номера нет WhatsApp. Проверьте номер или попросите собеседника установить WhatsApp'

const createChat = async (phone: string) => {
	const { existsWhatsapp } = await greenApiService.checkWhatsapp(phone)
	if (!existsWhatsapp) throw new Error(NOT_IN_WHATSAPP_ERROR)
	return { chatId: toChatId(phone), phone }
}

export function useCreateChat(onCreated?: () => void): IHookForm<INewChatForm> {
	const upsertChat = useChatsStore(state => state.upsertChat)
	const setActiveChat = useChatsStore(state => state.setActiveChat)

	const { mutateAsync, isPending } = useMutation({
		mutationKey: MutationKeys.CREATE_CHAT,
		mutationFn: createChat
	})

	const form = useForm<INewChatForm>({ mode: 'onChange', defaultValues: { phone: '' } })

	const onSubmit: SubmitHandler<INewChatForm> = ({ phone }) => {
		const normalized = normalizePhone(phone)
		if (!normalized) {
			form.setError('phone', { message: INVALID_PHONE_ERROR })
			return
		}

		toast.promise(mutateAsync(normalized), {
			loading: 'Ищем номер в WhatsApp…',
			success: ({ chatId }) => {
				upsertChat({ chatId, title: formatPhone(normalized), phone: normalized })
				setActiveChat(chatId)
				form.reset()
				onCreated?.()
				return 'Чат создан'
			},
			error: errorCatch
		})
	}

	return { form, onSubmit, isPending }
}
