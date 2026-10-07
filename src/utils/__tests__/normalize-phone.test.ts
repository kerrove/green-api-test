import { formatPhone, getPhoneFromChatId, normalizePhone, toChatId } from '../normalize-phone'

describe('normalizePhone', () => {
	it.each([
		['+7 (999) 123-45-67', '79991234567'],
		['8 999 123 45 67', '79991234567'],
		['+375 29 123-45-67', '375291234567'],
		['+44 7911 123456', '447911123456'],
		['+1 (202) 555-0143', '12025550143'],
		['+55 11 91234-5678', '5511912345678']
	])('%s → %s', (input, expected) => {
		expect(normalizePhone(input)).toBe(expected)
	})

	it.each([['9991234567'], ['+44 7911 12'], ['12345678901234567'], ['']])('отвергает %p', input => {
		expect(normalizePhone(input)).toBeNull()
	})
})

describe('formatPhone', () => {
	it('форматирует российский номер', () => {
		expect(formatPhone('79991234567')).toBe('+7 999 123-45-67')
	})

	it('прочие номера показывает с плюсом', () => {
		expect(formatPhone('447911123456')).toBe('+447911123456')
	})
})

describe('toChatId / getPhoneFromChatId', () => {
	it('строит chatId личного чата и достаёт из него номер', () => {
		expect(toChatId('79991234567')).toBe('79991234567@c.us')
		expect(getPhoneFromChatId('79991234567@c.us')).toBe('79991234567')
	})

	it.each([['120363043968066561@g.us'], ['123456789012345@lid'], ['10000000']])(
		'для %p возвращает null',
		chatId => {
			expect(getPhoneFromChatId(chatId)).toBeNull()
		}
	)
})
