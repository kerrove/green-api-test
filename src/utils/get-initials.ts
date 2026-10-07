export const getInitials = (title: string): string | null => {
	const words = title.trim().split(/\s+/).filter(Boolean)
	if (!words.length || /^\+?\d/.test(words[0])) return null

	const letters = words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[1][0]
	return letters.toUpperCase()
}
