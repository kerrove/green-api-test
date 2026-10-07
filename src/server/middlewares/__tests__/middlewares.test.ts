import { NextRequest } from 'next/server'

import { proxy } from '../../../proxy'

const AUTH_COOKIE =
	'idInstance=3100000001; apiTokenInstance=token; apiUrl=https://api.green-api.com'

const request = (path: string, cookie?: string) =>
	new NextRequest(`http://localhost${path}`, { headers: cookie ? { cookie } : {} })

describe('proxy', () => {
	it('без кредов уводит с главной на /login', () => {
		const res = proxy(request('/'))
		expect(res.headers.get('location')).toBe('http://localhost/login')
	})

	it('с кредами пускает на главную', () => {
		const res = proxy(request('/', AUTH_COOKIE))
		expect(res.headers.get('location')).toBeNull()
		expect(res.headers.get('x-middleware-next')).toBe('1')
	})

	it('с кредами уводит с /login на главную', () => {
		const res = proxy(request('/login', AUTH_COOKIE))
		expect(res.headers.get('location')).toBe('http://localhost/')
	})

	it('без кредов пускает на /login', () => {
		const res = proxy(request('/login'))
		expect(res.headers.get('location')).toBeNull()
	})

	it('с неполными кредами считает пользователя неавторизованным', () => {
		const res = proxy(request('/', 'idInstance=3100000001'))
		expect(res.headers.get('location')).toBe('http://localhost/login')
	})
})
