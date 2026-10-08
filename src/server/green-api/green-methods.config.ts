import { EnumGreenMethod } from 'types/green-api.types'

export type THttpMethod = 'GET' | 'POST' | 'DELETE'

export interface IGreenMethodConfig {
	httpMethod: THttpMethod
	withId?: boolean
	query?: Record<string, string>
}

export type TProxyMethod = Exclude<
	EnumGreenMethod,
	| typeof EnumGreenMethod.GET_STATE_INSTANCE
	| typeof EnumGreenMethod.GET_SETTINGS
	| typeof EnumGreenMethod.SET_SETTINGS
>

export const GREEN_METHODS: Record<TProxyMethod, IGreenMethodConfig> = {
	[EnumGreenMethod.CHECK_WHATSAPP]: { httpMethod: 'POST' },
	[EnumGreenMethod.SEND_MESSAGE]: { httpMethod: 'POST' },
	[EnumGreenMethod.RECEIVE_NOTIFICATION]: { httpMethod: 'GET' },
	[EnumGreenMethod.DELETE_NOTIFICATION]: { httpMethod: 'DELETE', withId: true }
}

export const isProxyMethod = (method: string): method is TProxyMethod =>
	Object.hasOwn(GREEN_METHODS, method)
