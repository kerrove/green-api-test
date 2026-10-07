import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { LazyMotion, domAnimation } from 'framer-motion'
import type { ReactNode } from 'react'

export const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: { retry: false, gcTime: 0 },
			mutations: { retry: false }
		}
	})

export const createQueryWrapper = () => {
	const queryClient = createTestQueryClient()

	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			<LazyMotion features={domAnimation}>{children}</LazyMotion>
		</QueryClientProvider>
	)

	return { wrapper, queryClient }
}

export const renderWrapper = (component: ReactNode) => {
	const { wrapper, queryClient } = createQueryWrapper()
	const result = render(component, { wrapper })

	return { ...result, queryClient }
}
