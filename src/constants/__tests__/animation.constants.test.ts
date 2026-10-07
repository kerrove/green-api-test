import { MESSAGE_ANIMATION_PROPS } from '../animation.constants'

describe('animation.constants', () => {
	it('новое сообщение всплывает снизу из прозрачности', () => {
		expect(MESSAGE_ANIMATION_PROPS.initial).toEqual({ opacity: 0, y: 8 })
		expect(MESSAGE_ANIMATION_PROPS.animate).toEqual({ opacity: 1, y: 0 })
	})

	it('анимация короткая, чтобы не задерживать переписку', () => {
		expect(MESSAGE_ANIMATION_PROPS.transition?.duration).toBeLessThanOrEqual(0.25)
	})
})
