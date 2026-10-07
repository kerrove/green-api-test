import cn from 'clsx'
import type { ButtonHTMLAttributes, FC } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	label: string
	variant?: 'primary' | 'ghost'
}

export const IconButton: FC<Props> = ({
	label,
	variant = 'ghost',
	type = 'button',
	className,
	children,
	...rest
}) => {
	return (
		<button
			{...rest}
			type={type}
			aria-label={label}
			title={label}
			className={twMerge(
				cn(
					'flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40',
					{
						'bg-primary text-white enabled:hover:bg-primary-hover': variant === 'primary',
						'text-muted enabled:hover:bg-panel-hover enabled:hover:text-text': variant === 'ghost'
					}
				),
				className
			)}
		>
			{children}
		</button>
	)
}
