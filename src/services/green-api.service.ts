import { httpCliAuth } from 'api/axios'

import {
	EnumGreenMethod,
	type ICheckWhatsappData,
	type ICheckWhatsappResponse,
	type IDeleteNotificationResponse,
	type ISendMessageData,
	type ISendMessageResponse,
	type TReceiveNotificationResponse
} from 'types/green-api.types'

class GreenApiService {
	private readonly _BASE_URL = '/green'

	private _url(method: EnumGreenMethod) {
		return `${this._BASE_URL}/${method}`
	}

	public async checkWhatsapp(phone: string): Promise<ICheckWhatsappResponse> {
		const res = await httpCliAuth.post<ICheckWhatsappResponse>(
			this._url(EnumGreenMethod.CHECK_WHATSAPP),
			{ phoneNumber: Number(phone) } satisfies ICheckWhatsappData
		)
		return res.data
	}

	public async sendMessage(chatId: string, message: string): Promise<ISendMessageResponse> {
		const res = await httpCliAuth.post<ISendMessageResponse>(
			this._url(EnumGreenMethod.SEND_MESSAGE),
			{
				chatId,
				message
			} satisfies ISendMessageData
		)
		return res.data
	}

	public async receiveNotification(signal?: AbortSignal): Promise<TReceiveNotificationResponse> {
		const res = await httpCliAuth.get<TReceiveNotificationResponse>(
			this._url(EnumGreenMethod.RECEIVE_NOTIFICATION),
			{ signal }
		)
		return res.data?.receiptId ? res.data : null
	}

	public async deleteNotification(receiptId: number): Promise<IDeleteNotificationResponse> {
		const res = await httpCliAuth.delete<IDeleteNotificationResponse>(
			this._url(EnumGreenMethod.DELETE_NOTIFICATION),
			{ params: { id: receiptId } }
		)
		return res.data
	}
}

const greenApiService = new GreenApiService()
export default greenApiService
