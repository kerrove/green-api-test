import axios, { isAxiosError } from 'axios'

import { axiosConfig } from 'config/api/axios.config'
import { Pages } from 'config/pages/pages.config'

export const createUnauthorizedHandler =
	(navigate: (url: string) => void) =>
	(error: unknown): Promise<never> => {
		if (isAxiosError(error) && error.response?.status === 401) navigate(Pages.LOGOUT)
		return Promise.reject(error)
	}

export const httpCli = axios.create(axiosConfig)
export const httpCliAuth = axios.create(axiosConfig)

httpCliAuth.interceptors.response.use(
	response => response,
	createUnauthorizedHandler(url => window.location.assign(url))
)
