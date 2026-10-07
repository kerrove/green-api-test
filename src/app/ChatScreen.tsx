import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ChatPage } from 'components/chat/ChatPage'

import { Pages } from 'config/pages/pages.config'

import { getCredentials } from 'server/credentials/credentials.server'

export async function ChatScreen() {
	const credentials = getCredentials(await cookies())
	if (!credentials) redirect(Pages.LOGIN)

	return <ChatPage idInstance={credentials.idInstance} />
}
