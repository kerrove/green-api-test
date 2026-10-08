'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'

import instanceService from 'services/instance.service'

import { MutationKeys } from 'config/query/mutation-keys.config'
import { QueryKeys } from 'config/query/query-keys.config'

import { errorCatch } from 'api/api.helper'

export function useReceivingStatus() {
	const [isApplying, setIsApplying] = useState(false)

	const { data: status } = useQuery({
		queryKey: QueryKeys.RECEIVING_STATUS,
		queryFn: () => instanceService.getReceivingStatus(),
		staleTime: Infinity,
		retry: false
	})

	const { mutate, isPending } = useMutation({
		mutationKey: MutationKeys.ENABLE_RECEIVING,
		mutationFn: () => instanceService.enableReceiving(),
		onSuccess: () => {
			setIsApplying(true)
			toast.success('Настройки сохранены. GREEN-API применит их в течение 5 минут')
		},
		onError: error => toast.error(errorCatch(error))
	})

	return { status, isApplying, isPending, enableReceiving: () => mutate() }
}
