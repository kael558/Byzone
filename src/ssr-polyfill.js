// Minimal browser API polyfills for the SSR/prerender environment (Node.js).
// These are called at component render time (outside useEffect) in several routes.
if (typeof window === 'undefined') {
	const noop = () => null
	const storage = { getItem: noop, setItem: noop, removeItem: noop }

	globalThis.sessionStorage = storage
	globalThis.localStorage = storage
	globalThis.document = {
		createElement: () => ({ innerHTML: '', textContent: '' }),
	}
}
