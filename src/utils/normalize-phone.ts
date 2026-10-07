const PERSONAL_CHAT_SUFFIX = '@c.us'

export const normalizePhone = (input: string): string | null => {
	let digits = input.replace(/\D/g, '')
	if (digits.length === 11 && digits.startsWith('8')) digits = `7${digits.slice(1)}`

	return digits.length >= 11 && digits.length <= 16 ? digits : null
}

export const formatPhone = (digits: string): string => {
	const match = digits.match(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/)
	return match ? `+7 ${match[1]} ${match[2]}-${match[3]}-${match[4]}` : `+${digits}`
}

export const toChatId = (phone: string): string => `${phone}${PERSONAL_CHAT_SUFFIX}`

export const getPhoneFromChatId = (chatId: string): string | null =>
	chatId.match(/^(\d{11,16})@c\.us$/)?.[1] ?? null
