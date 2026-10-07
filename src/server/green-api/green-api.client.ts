import { GREEN_API_TIMEOUT_MS, RECEIVE_TIMEOUT_SECONDS } from 'constants/constants'

import type { ICredentials } from 'types/auth.types'
import { EnumGreenMethod } from 'types/green-api.types'

import { GreenApiError } from './green-api.error'
import type { THttpMethod } from './green-methods.config'

export type TFetcher = (input: string, init?: RequestInit) => Promise<Response>

interface IRequestOptions {
	httpMethod: THttpMethod
	id?: string
	body?: unknown
}

const ERROR_MESSAGES: Record<number, string> = {
	400: 'Некорректный запрос к GREEN-API',
	401: 'Неверные idInstance или apiTokenInstance',
	403: 'Доступ к инстансу запрещён',
	429: 'Слишком много запросов, попробуйте позже',
	466: 'Исчерпан лимит запросов тарифа',
	469: 'Исчерпан лимит проверок номеров'
}

const MAX_DETAIL_LENGTH = 200

const QUERY_BY_METHOD: Partial<Record<EnumGreenMethod, Record<string, string>>> = {
	[EnumGreenMethod.RECEIVE_NOTIFICATION]: { receiveTimeout: String(RECEIVE_TIMEOUT_SECONDS) }
}

export class GreenApiClient {
	private readonly _fetch: TFetcher

	constructor(fetcher: TFetcher = (input, init) => fetch(input, init)) {
		this._fetch = fetcher
	}

	public buildUrl(credentials: ICredentials, method: EnumGreenMethod, id?: string): string {
		const base = credentials.apiUrl.replace(/\/+$/, '')
		const path = [
			base,
			`waInstance${encodeURIComponent(credentials.idInstance)}`,
			method,
			encodeURIComponent(credentials.apiTokenInstance)
		]
		if (id) path.push(encodeURIComponent(id))

		const url = new URL(path.join('/'))
		for (const [key, value] of Object.entries(QUERY_BY_METHOD[method] ?? {})) {
			url.searchParams.set(key, value)
		}
		return url.toString()
	}

	private async _readErrorDetail(response: Response): Promise<string | null> {
		const text = (await response.text().catch(() => '')).trim()
		if (!text) return null

		try {
			const parsed: unknown = JSON.parse(text)
			const message = (parsed as { message?: unknown })?.message
			return typeof message === 'string' && message ? message.slice(0, MAX_DETAIL_LENGTH) : null
		} catch {
			return text.slice(0, MAX_DETAIL_LENGTH)
		}
	}

	public async request<T>(
		credentials: ICredentials,
		method: EnumGreenMethod,
		{ httpMethod, id, body }: IRequestOptions
	): Promise<T> {
		let response: Response
		try {
			response = await this._fetch(this.buildUrl(credentials, method, id), {
				method: httpMethod,
				headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
				body: body === undefined ? undefined : JSON.stringify(body),
				cache: 'no-store',
				signal: AbortSignal.timeout(GREEN_API_TIMEOUT_MS)
			})
		} catch {
			throw new GreenApiError(502, 'GREEN-API недоступен')
		}

		if (!response.ok) {
			const message = ERROR_MESSAGES[response.status] ?? `Ошибка GREEN-API (${response.status})`
			const detail = await this._readErrorDetail(response)
			throw new GreenApiError(response.status, detail ? `${message}: ${detail}` : message)
		}

		const text = await response.text()
		return (text ? JSON.parse(text) : null) as T
	}
}

export const greenApiClient = new GreenApiClient()
