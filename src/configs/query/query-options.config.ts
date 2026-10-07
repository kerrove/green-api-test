import { QueryClient } from '@tanstack/react-query'

import { IS_CLIENT } from 'constants/constants'

const queryClientOptions = {
	defaultOptions: {
		queries: { refetchOnWindowFocus: false, retry: 1 },
		mutations: { retry: 0 }
	}
}

let browserQueryClient: QueryClient | undefined

export function getQueryClient(): QueryClient {
	if (!IS_CLIENT) return new QueryClient(queryClientOptions)
	browserQueryClient ??= new QueryClient(queryClientOptions)
	return browserQueryClient
}
