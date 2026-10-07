import { httpCli } from 'api/axios'

import type { ILoginData, ILoginResponse } from 'types/auth.types'

class AuthService {
	private readonly _BASE_URL = '/auth'

	public async login(data: ILoginData): Promise<ILoginResponse> {
		const res = await httpCli.post<ILoginResponse>(`${this._BASE_URL}/login`, data)
		return res.data
	}
}

const authService = new AuthService()
export default authService
