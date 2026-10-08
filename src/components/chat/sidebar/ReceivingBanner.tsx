'use client'

import { TriangleAlert } from 'lucide-react'
import type { FC } from 'react'

import { Button } from 'ui/Button'

import { useReceivingStatus } from './useReceivingStatus'

export const ReceivingBanner: FC = () => {
	const { status, isApplying, isPending, enableReceiving } = useReceivingStatus()

	if (!status || status.canReceive) return null

	return (
		<div
			role='status'
			className='mx-3 mb-2 flex gap-3 rounded-lg bg-panel-active px-3 py-2.5 text-sm leading-5'
		>
			<TriangleAlert
				size={18}
				aria-hidden
				className='mt-0.5 shrink-0 text-warning'
			/>
			{isApplying ? (
				<p className='text-muted'>
					<span className='font-medium text-text'>Настройки применяются.</span> GREEN-API
					перезапустит инстанс в течение 5 минут — после этого ответы начнут приходить. Сообщения,
					отправленные вам раньше, не придут.
				</p>
			) : (
				<div className='flex flex-col gap-2'>
					{status.webhookUrlSet ? (
						<p className='text-muted'>
							<span className='font-medium text-text'>Ответы не будут приходить.</span> У инстанса
							задан webhookUrl, поэтому уведомления уходят туда, а не в приложение. Кнопка очистит
							его — если на этот адрес завязана другая интеграция, она перестанет получать
							уведомления.
						</p>
					) : (
						<p className='text-muted'>
							<span className='font-medium text-text'>
								Получение входящих выключено в настройках инстанса
							</span>
							, поэтому ответы собеседников не приходят.
						</p>
					)}
					<Button
						onClick={enableReceiving}
						disabled={isPending}
						className='h-9 self-start px-4 text-sm'
					>
						{status.webhookUrlSet ? 'Очистить webhookUrl' : 'Включить получение'}
					</Button>
				</div>
			)}
		</div>
	)
}
