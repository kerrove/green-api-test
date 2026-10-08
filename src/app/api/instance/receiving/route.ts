import { type NextRequest, NextResponse } from 'next/server'

import { getCredentials } from 'server/credentials/credentials.server'
import { errorResponse, greenErrorResponse } from 'server/green-api/error-response'
import { greenApiClient } from 'server/green-api/green-api.client'
import { ENABLE_RECEIVING_SETTINGS, toReceivingStatus } from 'server/green-api/receiving-settings'

import {
	EnumGreenMethod,
	type ISetSettingsResponse,
	type ISettingsResponse
} from 'types/green-api.types'

const UNAUTHORIZED_MESSAGE = 'Требуется авторизация'

export async function GET(req: NextRequest) {
	const credentials = getCredentials(req.cookies)
	if (!credentials) return errorResponse(401, UNAUTHORIZED_MESSAGE)

	try {
		const settings = await greenApiClient.request<ISettingsResponse>(
			credentials,
			EnumGreenMethod.GET_SETTINGS,
			{ httpMethod: 'GET' }
		)
		return NextResponse.json(toReceivingStatus(settings))
	} catch (error) {
		return greenErrorResponse(error)
	}
}

export async function POST(req: NextRequest) {
	const credentials = getCredentials(req.cookies)
	if (!credentials) return errorResponse(401, UNAUTHORIZED_MESSAGE)

	try {
		const result = await greenApiClient.request<ISetSettingsResponse>(
			credentials,
			EnumGreenMethod.SET_SETTINGS,
			{ httpMethod: 'POST', body: ENABLE_RECEIVING_SETTINGS }
		)
		return NextResponse.json(result)
	} catch (error) {
		return greenErrorResponse(error)
	}
}
