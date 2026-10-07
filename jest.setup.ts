import '@testing-library/jest-dom'

if (!Element.prototype.scrollIntoView) {
	Element.prototype.scrollIntoView = () => {}
}

window.scrollTo = () => {}

if (!('IntersectionObserver' in window)) {
	class IntersectionObserverStub {
		observe = () => {}
		unobserve = () => {}
		disconnect = () => {}
		takeRecords = () => []
		root = null
		rootMargin = ''
		thresholds = []
	}

	Object.defineProperty(window, 'IntersectionObserver', { value: IntersectionObserverStub })
}
