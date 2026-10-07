jest.mock('../../../../services/auth.service', () => ({
	__esModule: true,
	default: { login: jest.fn() }
}))
jest.mock('react-hot-toast')

import { fireEvent, screen, waitFor } from '@testing-library/react'
import { useRouter as getMockRouter } from 'next/navigation'
import { renderWrapper } from 'tests/helpers/wrapper'

import authService from '../../../../services/auth.service'
import { LoginPage } from '../../../../app/login/LoginPage'

const login = jest.mocked(authService.login)
const router = getMockRouter()

const fill = (label: string, value: string) =>
	fireEvent.change(screen.getByLabelText(label), { target: { value } })

const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Войти' }))

describe('LoginForm + useLogin', () => {
	it('по умолчанию подставляет apiUrl GREEN-API', () => {
		renderWrapper(<LoginPage />)

		expect(screen.getByLabelText('apiUrl')).toHaveValue('https://api.green-api.com')
	})

	it('отправляет креды и уходит в чат', async () => {
		login.mockResolvedValue({ idInstance: '3100000001' })
		renderWrapper(<LoginPage />)

		fill('idInstance', '3100000001')
		fill('apiTokenInstance', 'token')
		submit()

		await waitFor(() =>
			expect(login).toHaveBeenCalledWith({
				apiUrl: 'https://api.green-api.com',
				idInstance: '3100000001',
				apiTokenInstance: 'token'
			})
		)
		await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/'))
	})

	it('принимает apiUrl на greenapi.com и обрезает пробелы из копипасты', async () => {
		login.mockResolvedValue({ idInstance: '3100000001' })
		renderWrapper(<LoginPage />)

		fill('apiUrl', ' https://3100.api.greenapi.com \n')
		fill('idInstance', ' 3100000001 ')
		fill('apiTokenInstance', ' token ')
		submit()

		await waitFor(() =>
			expect(login).toHaveBeenCalledWith({
				apiUrl: 'https://3100.api.greenapi.com',
				idInstance: '3100000001',
				apiTokenInstance: 'token'
			})
		)
	})

	it('пустую форму не отправляет', async () => {
		renderWrapper(<LoginPage />)

		submit()

		expect(await screen.findAllByRole('alert')).toHaveLength(2)
		expect(login).not.toHaveBeenCalled()
	})

	it('валидирует формат idInstance и apiUrl', async () => {
		renderWrapper(<LoginPage />)

		fill('apiUrl', 'https://example.com')
		fill('idInstance', 'abc')
		fill('apiTokenInstance', 'token')
		submit()

		expect(await screen.findByText('idInstance состоит только из цифр')).toBeInTheDocument()
		expect(screen.getByText(/^Ожидается адрес вида/)).toBeInTheDocument()
		expect(login).not.toHaveBeenCalled()
	})

	it('при ошибке входа остаётся на странице', async () => {
		login.mockRejectedValue(new Error('Неверные данные'))
		renderWrapper(<LoginPage />)

		fill('idInstance', '3100000001')
		fill('apiTokenInstance', 'bad')
		submit()

		await waitFor(() => expect(login).toHaveBeenCalled())
		expect(router.replace).not.toHaveBeenCalled()
	})
})
