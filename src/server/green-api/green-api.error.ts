export class GreenApiError extends Error {
	readonly status: number

	constructor(status: number, message: string) {
		super(message)
		this.name = 'GreenApiError'
		this.status = status
	}
}
