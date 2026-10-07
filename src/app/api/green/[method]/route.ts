import { type NextRequest, NextResponse } from 'next/server'

import { getCredentials } from 'server/credentials/credentials.server'
import { errorResponse, greenErrorResponse } from 'server/green-api/error-response'
import { greenApiClient } from 'server/green-api/green-api.client'
import {
	GREEN_METHODS,
	type THttpMethod,
	isProxyMethod
} from 'server/green-api/green-methods.config'

interface IRouteContext {
	params: Promise<{ method: string }>
}

const handle = (httpMethod: THttpMethod) => async (req: NextRequest, context: IRouteContext) => {
	const { method } = await context.params
	if (!isProxyMethod(method) || GREEN_METHODS[method].httpMethod !== httpMethod) {
		return errorResponse(404, 'Метод не поддерживается')
	}

	const credentials = getCredentials(req.cookies)
	if (!credentials) return errorResponse(401, 'Требуется авторизация')

	const config = GREEN_METHODS[method]
	const id = req.nextUrl.searchParams.get('id') ?? undefined
	if (config.withId && !id) return errorResponse(400, 'Не передан id')

	const body = httpMethod === 'POST' ? await req.json().catch(() => null) : undefined
	if (httpMethod === 'POST' && !body) return errorResponse(400, 'Пустое тело запроса')

	try {
		const data = await greenApiClient.request(credentials, method, {
			httpMethod,
			id: config.withId ? id : undefined,
			body
		})
		return NextResponse.json(data)
	} catch (error) {
		return greenErrorResponse(error)
	}
}

export const GET = handle('GET')
export const POST = handle('POST')
export const DELETE = handle('DELETE')
