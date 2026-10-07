import { useRef } from 'react'
import toast from 'react-hot-toast'

import greenApiService from 'services/green-api.service'

import { useChatsStore } from 'store/chats.store'

import { parseNotification } from 'utils/parse-notification'

import { errorCatch } from 'api/api.helper'

import { type TPollingTask, usePolling } from './usePolling'

export const NOTIFICATIONS_ERROR_TOAST_ID = 'notifications-error'

export function useNotifications(enabled = true) {
	const addMessage = useChatsStore(state => state.addMessage)
	const hasErrorRef = useRef(false)

	const task: TPollingTask = async signal => {
		const notification = await greenApiService.receiveNotification(signal)
		if (hasErrorRef.current) {
			hasErrorRef.current = false
			toast.dismiss(NOTIFICATIONS_ERROR_TOAST_ID)
		}
		if (!notification) return false

		const event = parseNotification(notification.body)
		if (event) addMessage(event)

		await greenApiService.deleteNotification(notification.receiptId)
		return true
	}

	const onError = (error: unknown) => {
		hasErrorRef.current = true
		toast.error(`Не удалось получить сообщения: ${errorCatch(error)}`, {
			id: NOTIFICATIONS_ERROR_TOAST_ID
		})
	}

	usePolling(task, { enabled, onError })
}
