export const EnumCredentials = {
	ID_INSTANCE: 'idInstance',
	API_TOKEN_INSTANCE: 'apiTokenInstance',
	API_URL: 'apiUrl'
} as const
export type EnumCredentials = (typeof EnumCredentials)[keyof typeof EnumCredentials]

export interface ICredentials {
	idInstance: string
	apiTokenInstance: string
	apiUrl: string
}

export type ILoginData = ICredentials

export interface ILoginResponse {
	idInstance: string
}
