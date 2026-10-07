import type { NextRequest } from 'next/server'

import { Pages } from 'config/pages/pages.config'

import { clearCredentials } from 'server/credentials/credentials.server'
import { nextRedirect } from 'server/middlewares/next-redirect'

export function GET(req: NextRequest) {
	return clearCredentials(nextRedirect(Pages.LOGIN, req))
}
