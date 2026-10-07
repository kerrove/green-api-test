export class MutationKeys {
	static readonly LOGIN = ['login']
	static readonly CREATE_CHAT = ['create chat']
	static readonly SEND_MESSAGE = (chatId: string) => ['send message', chatId]
}
