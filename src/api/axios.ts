import axios from 'axios'

import { axiosConfig } from '@/configs/api/axios.config'

declare module 'axios' {
	export interface InternalAxiosRequestConfig {
		_isRetry?: boolean
	}
}

export const httpCli = axios.create(axiosConfig)
