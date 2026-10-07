interface IToastPromiseOptions<T> {
	loading: string
	success: (result: T) => string
	error: (error: unknown) => string
}

const toast = Object.assign(jest.fn(), {
	promise: async <T>(promise: Promise<T>, options: IToastPromiseOptions<T>) => {
		try {
			const result = await promise
			options.success(result)
			return result
		} catch (error) {
			options.error(error)
		}
	},
	success: jest.fn(),
	error: jest.fn(),
	loading: jest.fn(),
	dismiss: jest.fn()
})

export const Toaster = () => null

export default toast
