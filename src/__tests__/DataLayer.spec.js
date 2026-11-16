import DataLayer from '../DataLayer'
import TagManager from '../TagManager'
import warn from '../utils/warn'

jest.mock('../utils/warn')

describe('DataLayer', () => {
	beforeEach(() => {
		window['dataLayer'] = undefined
		window['customName'] = undefined
		window.document.head.innerHTML = ''
	})

	afterEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
	})

	describe('constructor', () => {
		it('should push to window.dataLayer by default', () => {
			window['dataLayer'] = []

			new DataLayer().pageChange({ route: '/oferta' })

			expect(window['dataLayer']).toStrictEqual([
				{ event: 'pageChange', route: '/oferta' },
			])
		})

		it('should push to a custom dataLayer name', () => {
			window['customName'] = []
			const dataLayerSpy = jest.spyOn(TagManager, 'dataLayer')

			new DataLayer({ dataLayerName: 'customName' }).pageChange({
				route: '/oferta',
			})

			expect(dataLayerSpy).toHaveBeenCalledTimes(1)
			expect(dataLayerSpy).toHaveBeenCalledWith({
				dataLayer: { event: 'pageChange', route: '/oferta' },
				dataLayerName: 'customName',
			})
			expect(window['customName']).toStrictEqual([
				{ event: 'pageChange', route: '/oferta' },
			])
			expect(window['dataLayer']).toBeUndefined()
		})

		it('should create a missing dataLayer through TagManager.dataLayer', () => {
			const dataLayerSpy = jest.spyOn(TagManager, 'dataLayer')

			new DataLayer().pageChange({ route: '/oferta' })

			const dataScript = window.document.querySelector(
				'[data-testid="dataLayer"]',
			)

			expect(dataLayerSpy).toHaveBeenCalledTimes(1)
			expect(dataLayerSpy).toHaveBeenCalledWith({
				dataLayer: { event: 'pageChange', route: '/oferta' },
				dataLayerName: 'dataLayer',
			})
			expect(dataScript).not.toBeNull()
			expect(window['dataLayer']).toStrictEqual([
				{ event: 'pageChange', route: '/oferta' },
			])
		})
	})

	describe('pageChange', () => {
		let dataLayerSpy

		beforeEach(() => {
			dataLayerSpy = jest
				.spyOn(TagManager, 'dataLayer')
				.mockImplementation(() => undefined)
		})

		it('should push the returned event through TagManager.dataLayer', () => {
			const event = new DataLayer().pageChange({ route: '/oferta' })

			expect(dataLayerSpy).toHaveBeenCalledTimes(1)
			expect(dataLayerSpy).toHaveBeenCalledWith({
				dataLayer: { event: 'pageChange', route: '/oferta' },
				dataLayerName: 'dataLayer',
			})
			expect(event).toBe(dataLayerSpy.mock.calls[0][0].dataLayer)
		})

		it('should add the deployName given to the constructor', () => {
			const event = new DataLayer({ deployName: 'prod' }).pageChange({
				route: '/oferta',
			})

			expect(event).toStrictEqual({
				event: 'pageChange',
				route: '/oferta',
				deployName: 'prod',
			})
			expect(dataLayerSpy).toHaveBeenCalledTimes(1)
			expect(dataLayerSpy).toHaveBeenCalledWith({
				dataLayer: {
					event: 'pageChange',
					route: '/oferta',
					deployName: 'prod',
				},
				dataLayerName: 'dataLayer',
			})
		})

		it('should prefer the deployName given to the call', () => {
			const event = new DataLayer({ deployName: 'prod' }).pageChange({
				route: '/oferta',
				deployName: 'uat',
			})

			expect(event).toStrictEqual({
				event: 'pageChange',
				route: '/oferta',
				deployName: 'uat',
			})
			expect(dataLayerSpy).toHaveBeenCalledTimes(1)
			expect(dataLayerSpy).toHaveBeenCalledWith({
				dataLayer: {
					event: 'pageChange',
					route: '/oferta',
					deployName: 'uat',
				},
				dataLayerName: 'dataLayer',
			})
		})

		it('should leave deployName out when none is given', () => {
			const event = new DataLayer().pageChange({ route: '/oferta' })

			expect(event).not.toHaveProperty('deployName')
			expect(dataLayerSpy).toHaveBeenCalledTimes(1)
			expect(dataLayerSpy).toHaveBeenCalledWith({
				dataLayer: { event: 'pageChange', route: '/oferta' },
				dataLayerName: 'dataLayer',
			})
		})

		it.each([
			{ title: 'an empty', templateName: '' },
			{ title: 'an undefined', templateName: undefined },
		])('should leave $title templateName out', ({ templateName }) => {
			const event = new DataLayer().pageChange({
				route: '/oferta',
				templateName,
			})

			expect(event).toStrictEqual({ event: 'pageChange', route: '/oferta' })
			expect(dataLayerSpy).toHaveBeenCalledTimes(1)
			expect(dataLayerSpy).toHaveBeenCalledWith({
				dataLayer: { event: 'pageChange', route: '/oferta' },
				dataLayerName: 'dataLayer',
			})
		})

		it.each([
			{ title: 'an empty', deployName: '' },
			{ title: 'an undefined', deployName: undefined },
		])('should leave $title deployName out', ({ deployName }) => {
			const event = new DataLayer().pageChange({
				route: '/oferta',
				deployName,
			})

			expect(event).toStrictEqual({ event: 'pageChange', route: '/oferta' })
			expect(dataLayerSpy).toHaveBeenCalledTimes(1)
			expect(dataLayerSpy).toHaveBeenCalledWith({
				dataLayer: { event: 'pageChange', route: '/oferta' },
				dataLayerName: 'dataLayer',
			})
		})

		it('should accept a templateName without a route', () => {
			const event = new DataLayer().pageChange({ templateName: 'Offer' })

			expect(event).toStrictEqual({
				event: 'pageChange',
				templateName: 'Offer',
			})
			expect(dataLayerSpy).toHaveBeenCalledTimes(1)
			expect(dataLayerSpy).toHaveBeenCalledWith({
				dataLayer: { event: 'pageChange', templateName: 'Offer' },
				dataLayerName: 'dataLayer',
			})
		})

		it('should keep event first and then route, templateName and deployName', () => {
			const event = new DataLayer().pageChange({
				deployName: 'prod',
				templateName: 'Offer',
				route: '/oferta',
			})

			expect(Object.keys(event)).toStrictEqual([
				'event',
				'route',
				'templateName',
				'deployName',
			])
			expect(dataLayerSpy).toHaveBeenCalledTimes(1)
			expect(dataLayerSpy).toHaveBeenCalledWith({
				dataLayer: {
					event: 'pageChange',
					route: '/oferta',
					templateName: 'Offer',
					deployName: 'prod',
				},
				dataLayerName: 'dataLayer',
			})
		})

		it.each([
			{ title: 'an empty object', fields: {} },
			{ title: 'an empty route', fields: { route: '' } },
			{ title: 'an empty templateName', fields: { templateName: '' } },
			{ title: 'no argument', fields: undefined },
		])(
			'should warn and push nothing without a route and a templateName for $title',
			({ fields }) => {
				const event = new DataLayer().pageChange(fields)

				expect(warn).toHaveBeenCalledTimes(1)
				expect(warn).toHaveBeenCalledWith(
					'pageChange needs a route or a templateName',
				)
				expect(dataLayerSpy).not.toHaveBeenCalled()
				expect(event).toBeUndefined()
			},
		)

		it('should ignore values that are not strings', () => {
			const event = new DataLayer().pageChange({
				route: 42,
				templateName: 'Offer',
			})

			expect(event).toStrictEqual({
				event: 'pageChange',
				templateName: 'Offer',
			})
			expect(dataLayerSpy).toHaveBeenCalledTimes(1)
			expect(dataLayerSpy).toHaveBeenCalledWith({
				dataLayer: { event: 'pageChange', templateName: 'Offer' },
				dataLayerName: 'dataLayer',
			})
		})
	})
})
