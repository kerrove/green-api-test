import { UserRound } from 'lucide-react'
import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'

import { getAvatarColor } from 'utils/get-avatar-color'
import { getInitials } from 'utils/get-initials'

interface Props {
	seed: string
	title: string
	className?: string
}

export const Avatar: FC<Props> = ({ seed, title, className }) => {
	const initials = getInitials(title)

	return (
		<span
			aria-hidden
			className={twMerge(
				'flex size-14 shrink-0 items-center justify-center rounded-full bg-linear-to-b text-lg font-semibold text-white select-none',
				getAvatarColor(seed),
				className
			)}
		>
			{initials ?? (
				<UserRound
					className='size-1/2'
					strokeWidth={2}
				/>
			)}
		</span>
	)
}
