import type { FC } from 'react'

const ITEMS = Array.from({ length: 7 }, (_, index) => index)

export const ChatSkeleton: FC = () => {
	return (
		<div
			aria-busy
			aria-label='Загрузка чатов'
			className='flex h-dvh'
		>
			<div className='w-[76px] bg-rail md:hidden' />
			<div className='grid flex-1 grid-cols-[minmax(18rem,24rem)_1fr] md:grid-cols-1'>
				<div className='flex flex-col border-r border-border bg-panel'>
					<div className='flex h-16 items-center px-5'>
						<div className='h-6 w-20 animate-pulse rounded bg-panel-active' />
					</div>
					{ITEMS.map(item => (
						<div
							key={item}
							className='flex items-center gap-3 px-4 py-2.5'
						>
							<div className='size-14 animate-pulse rounded-full bg-panel-active' />
							<div className='flex flex-1 flex-col gap-2'>
								<div className='h-3.5 w-1/2 animate-pulse rounded bg-panel-active' />
								<div className='h-3 w-4/5 animate-pulse rounded bg-panel-hover' />
							</div>
						</div>
					))}
				</div>
				<div className='bg-bg md:hidden' />
			</div>
		</div>
	)
}
