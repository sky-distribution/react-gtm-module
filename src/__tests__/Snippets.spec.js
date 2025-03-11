import Snippets from '../Snippets'

let args
let snippets

describe('Snippets', () => {
	beforeEach(() => {
		args = {
			id: 'GTM-xxxxxx',
			dataLayerName: 'dataLayer',
			events: {},
			source: 'https://googletagmanager.com/gtm.js',
		}
		snippets = Snippets.tags(args)
	})

	it('should use the `dataLayer` for the script', () => {
		args = { dataLayer: { name: 'test' } }
		snippets = Snippets.dataLayer(args)
		expect(snippets).toContain('{"name":"test"}')
	})

	it('should use the `dataLayerName` for the script', () => {
		args = { dataLayerName: 'customName' }
		snippets = Snippets.dataLayer(args)
		expect(snippets).toContain('customName')
	})

	it('should use the nonce for the script', () => {
		const nonce = 'pKFLb6zigj6vHak2TVeKx'
		Object.assign(args, { nonce })
		snippets = Snippets.tags(args)
		expect(snippets.script).toContain(`setAttribute('nonce','${nonce}')`, 1)
	})

	it('should use the source URL in script', () => {
		const source = 'https://tracking.example.com/gtm.js'
		Object.assign(args, { source })
		snippets = Snippets.tags(args)
		expect(snippets.script).toContain(`src='${source}?id=`)
	})

	it('should use the events in the script', () => {
		const events = [{ event: 'test', value: 100 }]
		Object.assign(args, { events })
		snippets = Snippets.tags(args)
		expect(snippets.script).toContain(JSON.stringify(events).slice(1, -1))
	})

	it('should set up auth and preview in the script', () => {
		const auth = 'auth'
		const preview = 'preview'
		Object.assign(args, { auth, preview })
		snippets = Snippets.tags(args)
		expect(snippets.script).toContain(`&gtm_auth=${auth}&gtm_preview=${preview}`)
	})
})
