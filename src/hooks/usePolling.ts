import { useEffect, useRef } from 'react'

import { POLLING_ERROR_DELAY_MS, POLLING_IDLE_DELAY_MS } from 'constants/constants'

export type TPollingTask = (signal: AbortSignal) => Promise<boolean>

interface IPollingOptions {
	enabled?: boolean
	idleDelay?: number
	errorDelay?: number
	onError?: (error: unknown) => void
}

const wait = (ms: number, signal: AbortSignal) =>
	new Promise<void>(resolve => {
		const timer = setTimeout(resolve, ms)
		signal.addEventListener('abort', () => {
			clearTimeout(timer)
			resolve()
		})
	})

const waitUntilVisible = (signal: AbortSignal) =>
	new Promise<void>(resolve => {
		if (!document.hidden) return resolve()

		const finish = () => {
			document.removeEventListener('visibilitychange', onChange)
			resolve()
		}
		const onChange = () => {
			if (!document.hidden) finish()
		}

		document.addEventListener('visibilitychange', onChange)
		signal.addEventListener('abort', finish)
	})

export function usePolling(
	task: TPollingTask,
	{
		enabled = true,
		idleDelay = POLLING_IDLE_DELAY_MS,
		errorDelay = POLLING_ERROR_DELAY_MS,
		onError
	}: IPollingOptions = {}
) {
	const taskRef = useRef(task)
	const onErrorRef = useRef(onError)

	useEffect(() => {
		taskRef.current = task
		onErrorRef.current = onError
	})

	useEffect(() => {
		if (!enabled) return

		const controller = new AbortController()
		const { signal } = controller

		const loop = async () => {
			while (!signal.aborted) {
				await waitUntilVisible(signal)
				if (signal.aborted) return

				try {
					const hasMore = await taskRef.current(signal)
					if (!hasMore) await wait(idleDelay, signal)
				} catch (error) {
					if (signal.aborted) return
					onErrorRef.current?.(error)
					await wait(errorDelay, signal)
				}
			}
		}

		loop()

		return () => controller.abort()
	}, [enabled, idleDelay, errorDelay])
}
