import { NextResponse } from 'next/server'

import { GreenApiError } from './green-api.error'

export const errorResponse = (status: number, message: string) =>
	NextResponse.json({ message }, { status })

export const greenErrorResponse = (error: unknown) =>
	error instanceof GreenApiError
		? errorResponse(error.status, error.message)
		: errorResponse(500, 'Внутренняя ошибка сервера')
