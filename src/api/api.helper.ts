import { isAxiosError } from 'axios'

const DEFAULT_ERROR = 'Что-то пошло не так'

export const errorCatch = (error: unknown): string => {
	if (typeof error === 'string') return error

	if (isAxiosError<{ message?: string }>(error)) {
		return error.response?.data?.message || error.message || DEFAULT_ERROR
	}

	return error instanceof Error && error.message ? error.message : DEFAULT_ERROR
}
