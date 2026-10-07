import { LogOut, MessageCircle } from 'lucide-react'
import type { FC } from 'react'

import { Pages } from 'config/pages/pages.config'

interface Props {
	idInstance: string
}

export const NavRail: FC<Props> = ({ idInstance }) => {
	return (
		<nav
			aria-label='Основная навигация'
			className='flex w-[76px] flex-col items-center justify-between bg-rail py-3 md:hidden'
		>
			<span
				aria-current='page'
				className='flex w-full flex-col items-center gap-1 py-1.5 text-[11px] font-medium text-text'
			>
				<MessageCircle
					size={24}
					strokeWidth={2}
					className='fill-text/90 text-text'
				/>
				Чаты
			</span>
			<a
				href={Pages.LOGOUT}
				title={`Выйти из инстанса ${idInstance}`}
				className='flex w-full flex-col items-center gap-1 py-1.5 text-[11px] font-medium text-muted transition-colors hover:text-text'
			>
				<LogOut
					size={22}
					strokeWidth={1.75}
				/>
				Выйти
			</a>
		</nav>
	)
}
