import type { NextResponse } from 'next/server'

import { CREDENTIALS_MAX_AGE_SECONDS, IS_PROD } from 'constants/constants'

import { EnumCredentials, type ICredentials } from 'types/auth.types'

interface ICookieReader {
	get: (name: string) => { value: string } | undefined
}

const COOKIE_OPTIONS = {
	httpOnly: true,
	sameSite: 'lax',
	secure: IS_PROD,
	path: '/',
	maxAge: CREDENTIALS_MAX_AGE_SECONDS
} as const

const CREDENTIAL_KEYS: Record<keyof ICredentials, EnumCredentials> = {
	idInstance: EnumCredentials.ID_INSTANCE,
	apiTokenInstance: EnumCredentials.API_TOKEN_INSTANCE,
	apiUrl: EnumCredentials.API_URL
}

export const getCredentials = (cookies: ICookieReader): ICredentials | null => {
	const idInstance = cookies.get(EnumCredentials.ID_INSTANCE)?.value
	const apiTokenInstance = cookies.get(EnumCredentials.API_TOKEN_INSTANCE)?.value
	const apiUrl = cookies.get(EnumCredentials.API_URL)?.value

	if (!idInstance || !apiTokenInstance || !apiUrl) return null

	return { idInstance, apiTokenInstance, apiUrl }
}

export const setCredentials = (res: NextResponse, credentials: ICredentials) => {
	for (const [key, name] of Object.entries(CREDENTIAL_KEYS)) {
		res.cookies.set(name, credentials[key as keyof ICredentials], COOKIE_OPTIONS)
	}
	return res
}

export const clearCredentials = (res: NextResponse) => {
	for (const name of Object.values(CREDENTIAL_KEYS)) {
		res.cookies.set(name, '', { ...COOKIE_OPTIONS, maxAge: 0 })
	}
	return res
}
