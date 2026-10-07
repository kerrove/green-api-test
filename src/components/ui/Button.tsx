import cn from 'clsx'
import type { ButtonHTMLAttributes, FC } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'ghost'
}

export const Button: FC<Props> = ({
	variant = 'primary',
	type = 'button',
	className,
	disabled,
	children,
	...rest
}) => {
	return (
		<button
			{...rest}
			type={type}
			disabled={disabled}
			className={twMerge(
				cn(
					'h-11 cursor-pointer rounded-lg px-5 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
					{
						'bg-primary text-white enabled:hover:bg-primary-hover': variant === 'primary',
						'bg-transparent text-muted enabled:hover:bg-panel-hover enabled:hover:text-text':
							variant === 'ghost'
					}
				),
				className
			)}
		>
			{children}
		</button>
	)
}
