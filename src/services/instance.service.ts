import { httpCliAuth } from 'api/axios'

import type { IReceivingStatus, ISetSettingsResponse } from 'types/green-api.types'

class InstanceService {
	private readonly _BASE_URL = '/instance'

	public async getReceivingStatus(): Promise<IReceivingStatus> {
		const res = await httpCliAuth.get<IReceivingStatus>(`${this._BASE_URL}/receiving`)
		return res.data
	}

	public async enableReceiving(): Promise<ISetSettingsResponse> {
		const res = await httpCliAuth.post<ISetSettingsResponse>(`${this._BASE_URL}/receiving`)
		return res.data
	}
}

const instanceService = new InstanceService()
export default instanceService
