export const IS_PROD: boolean = process.env.NODE_ENV === 'production'
export const IS_DEV: boolean = process.env.NODE_ENV === 'development'
export const IS_CLIENT = typeof window !== 'undefined'
export const DOMAIN: string | undefined = process.env.NEXT_PUBLIC_DOMAIN || undefined

export const DEFAULT_API_URL = 'https://api.green-api.com'
export const RECEIVE_TIMEOUT_SECONDS = 20
export const GREEN_API_TIMEOUT_MS = (RECEIVE_TIMEOUT_SECONDS + 10) * 1000
export const POLLING_IDLE_DELAY_MS = 5000
export const POLLING_ERROR_DELAY_MS = 10000
export const MESSAGE_MAX_LENGTH = 20000
export const CREDENTIALS_MAX_AGE_SECONDS = 60 * 60 * 24 * 30
