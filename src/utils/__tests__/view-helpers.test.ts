import { formatBubbleTime, formatMessageTime } from '../format-message-time'
import { getAvatarColor } from '../get-avatar-color'
import { getInitials } from '../get-initials'

describe('getInitials', () => {
	it.each([
		['Умники и умницы', 'УИ'],
		['Иван Петров', 'ИП'],
		['Лаурита', 'ЛА'],
		['+7 999 123-45-67', null],
		['   ', null]
	])('%s → %s', (title, expected) => {
		expect(getInitials(title)).toBe(expected)
	})
})

describe('getAvatarColor', () => {
	it('для одного chatId всегда один цвет', () => {
		expect(getAvatarColor('10000000')).toBe(getAvatarColor('10000000'))
	})

	it('возвращает градиент из палитры', () => {
		expect(getAvatarColor('abc')).toMatch(/^from-\[#[0-9a-f]{6}\] to-\[#[0-9a-f]{6}\]$/)
	})
})

describe('formatMessageTime', () => {
	const NOW = new Date(2026, 9, 7, 20, 0).getTime()

	it('сегодня показывает время', () => {
		expect(formatMessageTime(new Date(2026, 9, 7, 9, 5).getTime(), NOW)).toBe('09:05')
	})

	it('в этом году показывает день и месяц', () => {
		expect(formatMessageTime(new Date(2026, 8, 24, 9, 5).getTime(), NOW)).toBe('24 сент.')
	})

	it('в прошлом году показывает полную дату', () => {
		expect(formatMessageTime(new Date(2025, 0, 2).getTime(), NOW)).toBe('02.01.2025')
	})

	it('время пузыря в формате HH:mm', () => {
		expect(formatBubbleTime(new Date(2026, 9, 7, 19, 49).getTime())).toBe('19:49')
	})
})
