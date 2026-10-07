'use client'

import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import greenApiService from 'services/green-api.service'

import { MutationKeys } from 'config/query/mutation-keys.config'

import { useChatsStore } from 'store/chats.store'

import { errorCatch } from 'api/api.helper'

import { EnumMessageDirection } from 'types/chat.types'

export function useSendMessage(chatId: string) {
	const addMessage = useChatsStore(state => state.addMessage)

	const { mutateAsync, isPending } = useMutation({
		mutationKey: MutationKeys.SEND_MESSAGE(chatId),
		mutationFn: (text: string) => greenApiService.sendMessage(chatId, text)
	})

	const send = async (text: string): Promise<boolean> => {
		const message = text.trim()
		if (!message) return false

		try {
			const { idMessage } = await mutateAsync(message)
			addMessage({
				chatId,
				message: {
					id: idMessage,
					text: message,
					timestamp: Date.now(),
					direction: EnumMessageDirection.OUTGOING
				}
			})
			return true
		} catch (error) {
			toast.error(errorCatch(error))
			return false
		}
	}

	return { send, isPending }
}
