import type { Metadata } from 'next'

import { LoginPage } from './LoginPage'

export const metadata: Metadata = {
	title: 'Вход'
}

export default function PageLogin() {
	return <LoginPage />
}
