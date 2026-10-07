import { useEffect, useState } from 'react'

import { useChatsStore } from 'store/chats.store'

export function useChatsHydration(ownerId: string) {
	const [isHydrated, setIsHydrated] = useState(false)

	useEffect(() => {
		let isActive = true

		Promise.resolve(useChatsStore.persist.rehydrate()).then(() => {
			if (!isActive) return
			useChatsStore.getState().syncOwner(ownerId)
			setIsHydrated(true)
		})

		return () => {
			isActive = false
		}
	}, [ownerId])

	return isHydrated
}
