jest.mock('../../api/axios', () => ({
	httpCliAuth: { get: jest.fn(), post: jest.fn() }
}))

import { httpCliAuth } from '../../api/axios'
import instanceService from '../instance.service'

const http = jest.mocked(httpCliAuth)

describe('instanceService', () => {
	it('getReceivingStatus запрашивает признаки получения', async () => {
		const status = { canReceive: false, incomingEnabled: false, webhookUrlSet: false }
		http.get.mockResolvedValue({ data: status })

		await expect(instanceService.getReceivingStatus()).resolves.toEqual(status)
		expect(http.get).toHaveBeenCalledWith('/instance/receiving')
	})

	it('enableReceiving отправляет POST без тела', async () => {
		http.post.mockResolvedValue({ data: { saveSettings: true } })

		await expect(instanceService.enableReceiving()).resolves.toEqual({ saveSettings: true })
		expect(http.post).toHaveBeenCalledWith('/instance/receiving')
	})
})
