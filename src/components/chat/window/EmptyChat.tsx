import type { FC } from 'react'

export const EmptyChat: FC = () => {
	return (
		<div className='flex h-full items-center justify-center bg-bg px-6'>
			<p className='max-w-xs rounded-xl bg-black/35 px-3 py-1.5 text-center text-[13px] leading-5 text-text/80'>
				Выберите чат слева или нажмите «+», чтобы написать по номеру телефона
			</p>
		</div>
	)
}
