import type { Metadata } from 'next'

export const SEO = {
	SITE_NAME: 'GREEN-API Чат',
	DESCRIPTION: 'Отправка и получение сообщений WhatsApp через GREEN-API',
	NO_INDEX_PAGE: { robots: { index: false, follow: false } } satisfies Metadata
}
