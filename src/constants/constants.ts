export const IS_DEV: boolean = process.env.MODE === 'development'
export const IS_TEST: boolean = process.env.MODE === 'test'

export const API_URL = process.env.NEXT_PUBLIC_API_URL as string
export const SERVER_URL: string = process.env.NEXT_PUBLIC_SERVER_URL as string
export const CLIENT_URL: string = process.env.NEXT_PUBLIC_CLIENT_URL as string
export const DOMAIN: string = process.env.NEXT_PUBLIC_CLIENT_DOMAIN as string

export const IS_CLIENT = typeof window !== 'undefined'
