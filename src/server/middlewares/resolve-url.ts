import { DOMAIN } from 'constants/constants'

const withProtocol = (domain: string, requestUrl: string) =>
	/^https?:\/\//.test(domain) ? domain : `${new URL(requestUrl).protocol}//${domain}`

export const resolveUrl = (
	path: string,
	requestUrl: string,
	domain: string | undefined = DOMAIN
): string => new URL(path, domain ? withProtocol(domain, requestUrl) : requestUrl).toString()
