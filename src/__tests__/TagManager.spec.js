import TagManager from '../TagManager'
import warn from '../utils/warn'

jest.mock('../utils/warn')

describe('TagManager', () => {
	// Cleans the environment to ensure tests do not reference resources from previous tests (such as script tags)
	beforeEach(() => {
		window['dataLayer'] = undefined
		window.document.body.innerHTML = ''
		window.document.head.innerHTML = ''
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should log a warn if no gtmId provided', () => {
		TagManager.initialize({})
		expect(warn).toHaveBeenCalledTimes(1)
	})

	it('should not inject tagmanager if no gtmId provided', () => {
		TagManager.initialize({})
		const dataScript = window.document.querySelector('[data-testid="gtm"]')
		expect(dataScript).toBe(null)
	})

	it('should inject tagmanager', () => {
		TagManager.initialize({ gtmId: 'GTM-xxxxxx' })
		const gtmScript = window.document.querySelector('[data-testid="gtm"]')
		expect(window.dataLayer).toHaveLength(1)
		expect(gtmScript).not.toBeUndefined()
	})

	it('should create dataLayer', () => {
		const dataLayer = {
			userInfo: 'userInfo',
		}
		const gtmArgs = {
			gtmId: 'GTM-xxxxxx',
			dataLayer,
		}
		TagManager.initialize(gtmArgs)
		expect(window.dataLayer[0]).toEqual(dataLayer)
		const dataScript = window.document.querySelector('[data-testid="dataLayer"]')
		expect(dataScript.nonce).toBe('')
	})

	it('should create dataLayer script with nonce', () => {
		const dataLayer = {
			userInfo: 'userInfo',
		}
		const gtmArgs = {
			gtmId: 'GTM-xxxxxx',
			dataLayer,
			nonce: 'foo',
		}
		TagManager.initialize(gtmArgs)
		expect(window.dataLayer[0]).toEqual(dataLayer)
		const dataScript = window.document.querySelector('[data-testid="dataLayer"]')
		expect(dataScript).not.toBeUndefined()
		expect(dataScript.nonce).toBe('foo')
	})

	it('should inject gtm script with nonce', () => {
		TagManager.initialize({ gtmId: 'GTM-xxxxxx', nonce: 'foo' })
		const gtmScript = window.document.querySelector('[data-testid="gtm"]')
		expect(gtmScript.nonce).toBe('foo')
	})

	it('should use custom dataLayer name', () => {
		const dataLayerName = 'customName'
		TagManager.initialize({ gtmId: 'GTM-xxxxxx', dataLayerName })
		expect(window[dataLayerName]).not.toBeUndefined()
		expect(window[dataLayerName]).toHaveLength(1)
	})

	it('should add an event to dataLayer', () => {
		TagManager.initialize({ gtmId: 'GTM-xxxxxx' })
		TagManager.dataLayer({ dataLayer: { event: 'test' } })
		expect(window['dataLayer']).toHaveLength(2)
	})

	it('should create non-existing dataLayer', () => {
		TagManager.dataLayer({ dataLayer: { event: 'test' } })
		expect(window['dataLayer']).not.toBeUndefined()
		expect(window['dataLayer']).toHaveLength(1)
	})
})
