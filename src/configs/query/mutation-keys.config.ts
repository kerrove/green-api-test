export class MutationKeys {
	static readonly LOGIN = ['login']
	static readonly CREATE_CHAT = ['create chat']
	static readonly ENABLE_RECEIVING = ['enable receiving']
	static readonly SEND_MESSAGE = (chatId: string) => ['send message', chatId]
}
