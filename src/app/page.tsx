import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ChatScreen } from './ChatScreen'
import { ChatSkeleton } from './ChatSkeleton'

export const metadata: Metadata = {
	title: 'Чаты'
}

export default function PageHome() {
	return (
		<Suspense fallback={<ChatSkeleton />}>
			<ChatScreen />
		</Suspense>
	)
}
