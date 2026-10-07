import type { CreateAxiosDefaults } from 'axios'

import { API_URL, IS_CLIENT } from '@/constants/constants'

const baseURL = IS_CLIENT && process.env.NEXT_PUBLIC_MODE === 'test' ? '/v1' : API_URL

export const axiosConfig: CreateAxiosDefaults = {
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
	baseURL,
	maxRedirects: 5,
	timeout: 15000
}
