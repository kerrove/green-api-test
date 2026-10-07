const replace = jest.fn()
const push = jest.fn()
const refresh = jest.fn()

const useRouter = () => ({ replace, push, refresh })
const usePathname = () => '/'
const useSearchParams = () => new URLSearchParams()
const redirect = jest.fn()

module.exports = {
	useRouter,
	usePathname,
	useSearchParams,
	redirect,
	unstable_rethrow: () => {}
}
