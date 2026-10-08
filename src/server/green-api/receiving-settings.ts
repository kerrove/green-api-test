import type { IReceivingStatus, ISetSettingsData, ISettingsResponse } from 'types/green-api.types'

const ENABLED = 'yes'

export const ENABLE_RECEIVING_SETTINGS = {
	incomingWebhook: ENABLED,
	webhookUrl: ''
} as const satisfies ISetSettingsData

export const toReceivingStatus = (settings: ISettingsResponse | null): IReceivingStatus => {
	const incomingEnabled = settings?.incomingWebhook === ENABLED
	const webhookUrlSet = !!settings?.webhookUrl?.trim()

	return { canReceive: incomingEnabled && !webhookUrlSet, incomingEnabled, webhookUrlSet }
}
