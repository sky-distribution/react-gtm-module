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

	describe('pageChange', () => {
		beforeEach(() => {
			window['dataLayer'] = []
			window['customName'] = []
		})

		afterEach(() => {
			jest.restoreAllMocks()
			delete window['customName']
		})

		it('should push the event to the default dataLayer', () => {
			TagManager.pageChange({ route: '/oferta', deployName: 'prod' })

			expect(window['dataLayer']).toStrictEqual([{ event: 'pageChange', route: '/oferta', deployName: 'prod' }])
		})

		it('should push the event to a custom dataLayer', () => {
			TagManager.pageChange({ templateName: 'Offer', dataLayerName: 'customName' })

			expect(window['customName']).toStrictEqual([{ event: 'pageChange', templateName: 'Offer' }])
			expect(window['dataLayer']).toHaveLength(0)
		})

		it.each([
			{ title: 'a custom', input: { dataLayerName: 'customName' }, expected: 'customName' },
			{ title: 'the default', input: {}, expected: 'dataLayer' },
		])('should delegate to dataLayer with $title dataLayerName', ({ input, expected }) => {
			const dataLayerSpy = jest.spyOn(TagManager, 'dataLayer').mockImplementation(() => undefined)

			TagManager.pageChange({ route: '/oferta', ...input })

			expect(dataLayerSpy).toHaveBeenCalledWith({
				dataLayer: { event: 'pageChange', route: '/oferta' },
				dataLayerName: expected,
			})
		})

		it('should work after destructuring', () => {
			const { pageChange } = TagManager

			pageChange({ route: '/oferta' })

			expect(window['dataLayer']).toStrictEqual([{ event: 'pageChange', route: '/oferta' }])
		})

		it('should omit empty fields in the pushed object', () => {
			TagManager.pageChange({ route: '/oferta', templateName: '', deployName: undefined })

			expect(window['dataLayer']).toStrictEqual([{ event: 'pageChange', route: '/oferta' }])
		})

		it('should expose createPageChangeEvent', () => {
			expect(TagManager.createPageChangeEvent({ route: '/oferta' })).toStrictEqual({
				event: 'pageChange',
				route: '/oferta',
			})
		})
	})
})
