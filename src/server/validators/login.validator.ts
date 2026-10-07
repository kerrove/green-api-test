import { API_URL_PATTERN, ID_INSTANCE_PATTERN } from 'utils/validators/fields.validator'

import type { ICredentials } from 'types/auth.types'

const isString = (value: unknown): value is string => typeof value === 'string'

export const parseLoginData = (data: unknown): ICredentials | null => {
	if (!data || typeof data !== 'object') return null

	const { idInstance, apiTokenInstance, apiUrl } = data as Record<string, unknown>
	if (!isString(idInstance) || !isString(apiTokenInstance) || !isString(apiUrl)) return null

	const credentials = {
		idInstance: idInstance.trim(),
		apiTokenInstance: apiTokenInstance.trim(),
		apiUrl: apiUrl.trim().replace(/\/+$/, '')
	}

	if (
		!ID_INSTANCE_PATTERN.value.test(credentials.idInstance) ||
		!API_URL_PATTERN.value.test(credentials.apiUrl) ||
		!credentials.apiTokenInstance
	)
		return null

	return credentials
}
