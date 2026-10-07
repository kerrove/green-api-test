'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { IS_DEV } from 'constants/constants'

import { getQueryClient } from 'config/query/query-options.config'

import type { TWithChildren } from 'types/types'

const DynamicToaster = dynamic(() => import('react-hot-toast').then(mod => mod.Toaster), {
	ssr: false
})

const TOAST_OPTIONS = {
	style: { background: 'var(--panel-active)', color: 'var(--text)' }
}

export default function Providers({ children }: TWithChildren) {
	const [queryClient] = useState(getQueryClient)

	return (
		<QueryClientProvider client={queryClient}>
			<MotionConfig reducedMotion='user'>
				<LazyMotion features={domAnimation}>
					{children}
					{IS_DEV && <ReactQueryDevtools initialIsOpen={false} />}
					<DynamicToaster
						position='top-center'
						toastOptions={TOAST_OPTIONS}
					/>
				</LazyMotion>
			</MotionConfig>
		</QueryClientProvider>
	)
}
