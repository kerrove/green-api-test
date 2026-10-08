import { resolveUrl } from '../resolve-url'

const REQUEST_URL = 'http://0.0.0.0/logout'

describe('resolveUrl', () => {
	it('строит адрес от NEXT_PUBLIC_DOMAIN, а не от адреса, который слушает сервер', () => {
		expect(resolveUrl('/login', REQUEST_URL, 'https://chat.example.com')).toBe(
			'https://chat.example.com/login'
		)
	})

	it('домен без протокола дополняет протоколом запроса', () => {
		expect(resolveUrl('/login', REQUEST_URL, 'localhost')).toBe('http://localhost/login')
	})

	it('сохраняет порт из домена', () => {
		expect(resolveUrl('/', REQUEST_URL, 'http://localhost:3000')).toBe('http://localhost:3000/')
	})

	it('с пустым доменом берёт адрес запроса', () => {
		expect(resolveUrl('/login', 'http://localhost/logout', '')).toBe('http://localhost/login')
	})
})
