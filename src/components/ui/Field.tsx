import { type FC, type InputHTMLAttributes, useId } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

interface Props extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'onChange' | 'onBlur' | 'name'
> {
	label: string
	registration: UseFormRegisterReturn
	error?: string
	hint?: string
}

export const Field: FC<Props> = ({ label, registration, error, hint, className, ...props }) => {
	const inputId = useId()
	const describedById = useId()
	const description = error || hint

	return (
		<div className='flex flex-col gap-1.5'>
			<label
				htmlFor={inputId}
				className='text-sm font-medium text-muted'
			>
				{label}
			</label>
			<input
				{...props}
				{...registration}
				id={inputId}
				aria-invalid={error ? true : undefined}
				aria-describedby={description ? describedById : undefined}
				className={twMerge(
					'h-11 rounded-lg border border-transparent bg-input px-3.5 text-[15px] text-text placeholder:text-muted transition-colors focus:border-primary focus:outline-none',
					error && 'border-red',
					className
				)}
			/>
			{description && (
				<span
					id={describedById}
					role={error ? 'alert' : undefined}
					className={error ? 'text-xs text-red' : 'text-xs text-muted'}
				>
					{description}
				</span>
			)}
		</div>
	)
}
