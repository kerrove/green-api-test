const AVATAR_GRADIENTS = [
	'from-[#6aa6ff] to-[#3d6fe0]',
	'from-[#b48cff] to-[#7c55e6]',
	'from-[#ff8fc0] to-[#e05592]',
	'from-[#5fd3a6] to-[#2f9e78]',
	'from-[#ffb36b] to-[#e47c33]',
	'from-[#6fd0ee] to-[#3197bd]'
] as const

export const getAvatarColor = (seed: string): (typeof AVATAR_GRADIENTS)[number] => {
	const hash = [...seed].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0)
	return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length]
}
