import { parseLoginData } from '../login.validator'

const VALID = {
	idInstance: ' 3100000001 ',
	apiTokenInstance: ' token ',
	apiUrl: 'https://3100.api.green-api.com/'
}

describe('parseLoginData', () => {
	it('обрезает пробелы и завершающий слэш', () => {
		expect(parseLoginData(VALID)).toEqual({
			idInstance: '3100000001',
			apiTokenInstance: 'token',
			apiUrl: 'https://3100.api.green-api.com'
		})
	})

	it.each([
		'https://3100.api.greenapi.com',
		'https://7103.api.green-api.com/',
		'  https://api.green-api.com\n'
	])('принимает apiUrl из консоли: %p', apiUrl => {
		expect(parseLoginData({ ...VALID, apiUrl })?.apiUrl).toBe(apiUrl.trim().replace(/\/$/, ''))
	})

	it.each([
		['не объект', null],
		['похожий, но чужой домен', { ...VALID, apiUrl: 'https://green-api.com.evil.io' }],
		['домен с префиксом', { ...VALID, apiUrl: 'https://notgreenapi.com' }],
		['нецифровой idInstance', { ...VALID, idInstance: 'abc' }],
		['пустой токен', { ...VALID, apiTokenInstance: '  ' }],
		['чужой домен в apiUrl', { ...VALID, apiUrl: 'https://evil.example.com' }],
		['http вместо https', { ...VALID, apiUrl: 'http://api.green-api.com' }],
		['не строка', { ...VALID, idInstance: 3100000001 }]
	])('отвергает: %s', (_, data) => {
		expect(parseLoginData(data)).toBeNull()
	})
})
