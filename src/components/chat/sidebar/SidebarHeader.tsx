import { LogOut, Plus } from 'lucide-react'
import type { FC } from 'react'

import { Pages } from 'config/pages/pages.config'

interface Props {
	onCreateChat: () => void
}

export const SidebarHeader: FC<Props> = ({ onCreateChat }) => {
	return (
		<header className='flex h-16 shrink-0 items-center justify-between gap-2 pr-4 pl-5'>
			<div className='flex items-baseline gap-2'>
				<h1 className='text-[22px] font-bold tracking-tight'>Чаты</h1>
				<span className='text-[13px] font-medium text-muted'>WhatsApp</span>
			</div>
			<div className='flex items-center gap-1'>
				<a
					href={Pages.LOGOUT}
					aria-label='Выйти'
					className='hidden size-9 items-center justify-center rounded-full text-muted transition-colors hover:text-text md:flex'
				>
					<LogOut size={20} />
				</a>
				<button
					type='button'
					onClick={onCreateChat}
					aria-label='Новый чат'
					title='Новый чат'
					className='flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover'
				>
					<Plus
						size={20}
						strokeWidth={2.25}
					/>
				</button>
			</div>
		</header>
	)
}
