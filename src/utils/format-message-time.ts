import dayjs from 'dayjs'
import 'dayjs/locale/ru'

export const formatMessageTime = (timestamp: number, now: number = Date.now()): string => {
	const date = dayjs(timestamp).locale('ru')
	const current = dayjs(now)

	if (date.isSame(current, 'day')) return date.format('HH:mm')
	if (date.isSame(current, 'year')) return date.format('D MMM')
	return date.format('DD.MM.YYYY')
}

export const formatBubbleTime = (timestamp: number): string => dayjs(timestamp).format('HH:mm')
