import { act, renderHook, waitFor } from '@testing-library/react'

import { usePolling } from '../usePolling'

const setHidden = (hidden: boolean) => {
	Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden })
	document.dispatchEvent(new Event('visibilitychange'))
}

afterEach(() => {
	jest.useRealTimers()
	setHidden(false)
})

describe('usePolling', () => {
	it('после пустого ответа ждёт idleDelay', async () => {
		jest.useFakeTimers()
		const task = jest.fn().mockResolvedValue(false)

		renderHook(() => usePolling(task, { idleDelay: 5000 }))

		await act(async () => {
			await jest.advanceTimersByTimeAsync(0)
		})
		expect(task).toHaveBeenCalledTimes(1)

		await act(async () => {
			await jest.advanceTimersByTimeAsync(4999)
		})
		expect(task).toHaveBeenCalledTimes(1)

		await act(async () => {
			await jest.advanceTimersByTimeAsync(1)
		})
		expect(task).toHaveBeenCalledTimes(2)
	})

	it('если что-то пришло, сразу запрашивает снова', async () => {
		jest.useFakeTimers()
		const task = jest
			.fn()
			.mockResolvedValueOnce(true)
			.mockResolvedValueOnce(true)
			.mockResolvedValue(false)

		renderHook(() => usePolling(task, { idleDelay: 5000 }))

		await act(async () => {
			await jest.advanceTimersByTimeAsync(0)
		})
		expect(task).toHaveBeenCalledTimes(3)
	})

	it('не запускается при enabled=false', () => {
		const task = jest.fn().mockResolvedValue(false)
		renderHook(() => usePolling(task, { enabled: false }))

		expect(task).not.toHaveBeenCalled()
	})

	it('при ошибке зовёт onError и ждёт errorDelay', async () => {
		jest.useFakeTimers()
		const onError = jest.fn()
		const task = jest
			.fn()
			.mockRejectedValueOnce(new Error('fail'))
			.mockReturnValue(new Promise(() => {}))

		renderHook(() => usePolling(task, { onError, errorDelay: 1000 }))

		await act(async () => {
			await jest.advanceTimersByTimeAsync(0)
		})
		expect(onError).toHaveBeenCalledWith(new Error('fail'))
		expect(task).toHaveBeenCalledTimes(1)

		await act(async () => {
			await jest.advanceTimersByTimeAsync(1000)
		})
		expect(task).toHaveBeenCalledTimes(2)
	})

	it('пока вкладка скрыта, не опрашивает', async () => {
		jest.useFakeTimers()
		setHidden(true)
		const task = jest.fn().mockResolvedValue(false)

		renderHook(() => usePolling(task, { idleDelay: 1000 }))

		await act(async () => {
			await jest.advanceTimersByTimeAsync(10000)
		})
		expect(task).not.toHaveBeenCalled()

		await act(async () => {
			setHidden(false)
			await jest.advanceTimersByTimeAsync(0)
		})
		expect(task).toHaveBeenCalledTimes(1)
	})

	it('при размонтировании прерывает задачу через signal', async () => {
		const signals: AbortSignal[] = []
		const task = jest.fn((signal: AbortSignal) => {
			signals.push(signal)
			return new Promise<boolean>(() => {})
		})

		const { unmount } = renderHook(() => usePolling(task))
		await waitFor(() => expect(task).toHaveBeenCalled())
		unmount()

		expect(signals[0].aborted).toBe(true)
	})
})
