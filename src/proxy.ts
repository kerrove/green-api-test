import { type NextRequest, NextResponse } from 'next/server'

import { Pages } from 'config/pages/pages.config'

import { protectChat } from './server/middlewares/protect-chat.middleware'
import { protectLogin } from './server/middlewares/protect-login.middleware'

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	switch (true) {
		case pathname.startsWith(Pages.LOGIN):
			return protectLogin(request)
		case pathname === Pages.HOME:
			return protectChat(request)
		default:
			return NextResponse.next()
	}
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\..*).*)']
}
