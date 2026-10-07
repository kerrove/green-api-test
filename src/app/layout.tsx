import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import Providers from 'providers/Providers'

import { SEO } from 'constants/seo.constants'

import './globals.css'

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin', 'cyrillic']
})

export const metadata: Metadata = {
	title: { template: `%s | ${SEO.SITE_NAME}`, default: SEO.SITE_NAME },
	description: SEO.DESCRIPTION,
	...SEO.NO_INDEX_PAGE
}

export const viewport: Viewport = {
	themeColor: '#131318',
	colorScheme: 'dark'
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html
			lang='ru'
			className={`${inter.variable} h-full antialiased`}
		>
			<body className='h-full font-sans'>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
