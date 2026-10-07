import { NextRequest } from 'next/server'

import { GET } from '../route'

describe('GET /logout', () => {
	it('стирает cookie и уводит на /login', () => {
		const res = GET(new NextRequest('http://localhost/logout'))

		expect(res.headers.get('location')).toBe('http://localhost/login')
		for (const name of ['idInstance', 'apiTokenInstance', 'apiUrl']) {
			expect(res.cookies.get(name)).toMatchObject({ value: '', maxAge: 0 })
		}
	})
})
