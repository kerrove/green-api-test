import { type NextRequest, NextResponse } from 'next/server'

import { Pages } from 'config/pages/pages.config'

import { getCredentials } from '../credentials/credentials.server'

import { nextRedirect } from './next-redirect'

export function protectLogin(request: NextRequest) {
	return getCredentials(request.cookies) ? nextRedirect(Pages.HOME, request) : NextResponse.next()
}
