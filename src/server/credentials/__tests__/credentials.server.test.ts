import { NextResponse } from 'next/server'

import { clearCredentials, getCredentials, setCredentials } from '../credentials.server'

const CREDENTIALS = {
	idInstance: '3100000001',
	apiTokenInstance: 'secret-token',
	apiUrl: 'https://3100.api.green-api.com'
}

const reader = (values: Record<string, string>) => ({
	get: (name: string) => (name in values ? { value: values[name] } : undefined)
})

describe('credentials.server', () => {
	it('возвращает креды, когда все три cookie на месте', () => {
		expect(getCredentials(reader(CREDENTIALS))).toEqual(CREDENTIALS)
	})

	it('возвращает null, если хотя бы одной cookie нет', () => {
		const { apiTokenInstance, ...rest } = CREDENTIALS
		expect(apiTokenInstance).toBeTruthy()
		expect(getCredentials(reader(rest))).toBeNull()
	})

	it('ставит httpOnly-cookie для каждого поля', () => {
		const res = setCredentials(NextResponse.json({}), CREDENTIALS)

		for (const [name, value] of Object.entries(CREDENTIALS)) {
			const cookie = res.cookies.get(name)
			expect(cookie?.value).toBe(value)
			expect(cookie?.httpOnly).toBe(true)
			expect(cookie?.sameSite).toBe('lax')
			expect(cookie?.path).toBe('/')
		}
	})

	it('очищает cookie с нулевым maxAge', () => {
		const res = clearCredentials(NextResponse.json({}))

		for (const name of Object.keys(CREDENTIALS)) {
			expect(res.cookies.get(name)?.value).toBe('')
			expect(res.cookies.get(name)?.maxAge).toBe(0)
		}
	})
})
