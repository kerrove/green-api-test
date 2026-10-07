import type { CreateAxiosDefaults } from 'axios'

import { GREEN_API_TIMEOUT_MS } from 'constants/constants'

export const axiosConfig: CreateAxiosDefaults = {
	baseURL: '/api',
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
	timeout: GREEN_API_TIMEOUT_MS
}
