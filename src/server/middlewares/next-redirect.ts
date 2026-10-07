import { type NextRequest, NextResponse } from 'next/server'

import { resolveUrl } from './resolve-url'

export const nextRedirect = (toUrl: string, request: NextRequest) =>
	NextResponse.redirect(resolveUrl(toUrl, request.url))
