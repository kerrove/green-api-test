import { type NextRequest, NextResponse } from 'next/server'

import { setCredentials } from 'server/credentials/credentials.server'
import { errorResponse, greenErrorResponse } from 'server/green-api/error-response'
import { greenApiClient } from 'server/green-api/green-api.client'
import { parseLoginData } from 'server/validators/login.validator'

import {
	EnumGreenMethod,
	EnumStateInstance,
	type ISettingsResponse,
	type IStateInstanceResponse,
	WHATSAPP_TYPE_INSTANCE
} from 'types/green-api.types'

const STATE_MESSAGES: Record<string, string> = {
	[EnumStateInstance.NOT_AUTHORIZED]:
		'К инстансу не подключён WhatsApp. Отсканируйте QR-код в личном кабинете GREEN-API',
	[EnumStateInstance.BLOCKED]: 'Инстанс заблокирован. Подробности — в личном кабинете GREEN-API',
	[EnumStateInstance.STARTING]: 'Инстанс запускается, попробуйте через минуту',
	[EnumStateInstance.SUSPENDED]:
		'Инстанс приостановлен — проверьте оплату в личном кабинете GREEN-API',
	[EnumStateInstance.PENDING_PASSWORD]: 'Инстанс ждёт ввода пароля в личном кабинете GREEN-API'
}

export async function POST(req: NextRequest) {
	const credentials = parseLoginData(await req.json().catch(() => null))
	if (!credentials) return errorResponse(400, 'Проверьте apiUrl, idInstance и apiTokenInstance')

	try {
		const state = await greenApiClient.request<IStateInstanceResponse>(
			credentials,
			EnumGreenMethod.GET_STATE_INSTANCE,
			{ httpMethod: 'GET' }
		)

		if (state?.stateInstance !== EnumStateInstance.AUTHORIZED) {
			return errorResponse(
				403,
				STATE_MESSAGES[state?.stateInstance] ?? 'Инстанс недоступен для отправки сообщений'
			)
		}

		const settings = await greenApiClient.request<ISettingsResponse>(
			credentials,
			EnumGreenMethod.GET_SETTINGS,
			{ httpMethod: 'GET' }
		)
		const typeInstance = settings?.typeInstance
		if (typeInstance && typeInstance !== WHATSAPP_TYPE_INSTANCE) {
			return errorResponse(
				422,
				'Это не WhatsApp-инстанс. Создайте инстанс WhatsApp в личном кабинете GREEN-API'
			)
		}

		return setCredentials(NextResponse.json({ idInstance: credentials.idInstance }), credentials)
	} catch (error) {
		return greenErrorResponse(error)
	}
}
