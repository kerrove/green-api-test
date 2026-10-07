import type { HTMLMotionProps } from 'framer-motion'

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

export const MESSAGE_ANIMATION_PROPS: Omit<HTMLMotionProps<'li'>, 'ref'> = {
	initial: { opacity: 0, y: 8 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.2, ease: EASE_OUT_EXPO }
}
