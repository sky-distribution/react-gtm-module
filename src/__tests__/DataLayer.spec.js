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

			new DataLayer({ dataLayerName: 'customName' }).pageChange({
				route: '/oferta',
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

		it('should hand every event to a custom push', () => {
			const pushMock = jest.fn()

			const event = new DataLayer({ push: pushMock }).pageChange({
				route: '/oferta',
			})

			expect(pushMock).toHaveBeenCalledTimes(1)
			expect(pushMock).toHaveBeenCalledWith({
				event: 'pageChange',
				route: '/oferta',
			})
			expect(event).toBe(pushMock.mock.calls[0][0])
			expect(window['dataLayer']).toBeUndefined()
		})
	})

	describe('pageChange', () => {
		it('should add the deployName given to the constructor', () => {
			const pushMock = jest.fn()

			const event = new DataLayer({
				deployName: 'prod',
				push: pushMock,
			}).pageChange({ route: '/oferta' })

			expect(event).toStrictEqual({
				event: 'pageChange',
				route: '/oferta',
				deployName: 'prod',
			})
			expect(pushMock).toHaveBeenCalledTimes(1)
			expect(pushMock).toHaveBeenCalledWith({
				event: 'pageChange',
				route: '/oferta',
				deployName: 'prod',
			})
		})

		it('should prefer the deployName given to the call', () => {
			const pushMock = jest.fn()

			const event = new DataLayer({
				deployName: 'prod',
				push: pushMock,
			}).pageChange({ route: '/oferta', deployName: 'uat' })

			expect(event).toStrictEqual({
				event: 'pageChange',
				route: '/oferta',
				deployName: 'uat',
			})
			expect(pushMock).toHaveBeenCalledTimes(1)
			expect(pushMock).toHaveBeenCalledWith({
				event: 'pageChange',
				route: '/oferta',
				deployName: 'uat',
			})
		})

		it('should leave deployName out when none is given', () => {
			const pushMock = jest.fn()

			const event = new DataLayer({ push: pushMock }).pageChange({
				route: '/oferta',
			})

			expect(event).not.toHaveProperty('deployName')
			expect(pushMock).toHaveBeenCalledTimes(1)
			expect(pushMock).toHaveBeenCalledWith({
				event: 'pageChange',
				route: '/oferta',
			})
		})

		it.each([
			{ title: 'an empty', templateName: '' },
			{ title: 'an undefined', templateName: undefined },
		])('should leave $title templateName out', ({ templateName }) => {
			const pushMock = jest.fn()

			const event = new DataLayer({ push: pushMock }).pageChange({
				route: '/oferta',
				templateName,
			})

			expect(event).toStrictEqual({ event: 'pageChange', route: '/oferta' })
			expect(pushMock).toHaveBeenCalledTimes(1)
			expect(pushMock).toHaveBeenCalledWith({
				event: 'pageChange',
				route: '/oferta',
			})
		})

		it.each([
			{ title: 'an empty', deployName: '' },
			{ title: 'an undefined', deployName: undefined },
		])('should leave $title deployName out', ({ deployName }) => {
			const pushMock = jest.fn()

			const event = new DataLayer({ push: pushMock }).pageChange({
				route: '/oferta',
				deployName,
			})

			expect(event).toStrictEqual({ event: 'pageChange', route: '/oferta' })
			expect(pushMock).toHaveBeenCalledTimes(1)
			expect(pushMock).toHaveBeenCalledWith({
				event: 'pageChange',
				route: '/oferta',
			})
		})

		it('should accept a templateName without a route', () => {
			const pushMock = jest.fn()

			const event = new DataLayer({ push: pushMock }).pageChange({
				templateName: 'Offer',
			})

			expect(event).toStrictEqual({
				event: 'pageChange',
				templateName: 'Offer',
			})
			expect(pushMock).toHaveBeenCalledTimes(1)
			expect(pushMock).toHaveBeenCalledWith({
				event: 'pageChange',
				templateName: 'Offer',
			})
		})

		it('should keep event first and then route, templateName and deployName', () => {
			const pushMock = jest.fn()

			const event = new DataLayer({ push: pushMock }).pageChange({
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
			expect(pushMock).toHaveBeenCalledTimes(1)
			expect(pushMock).toHaveBeenCalledWith({
				event: 'pageChange',
				route: '/oferta',
				templateName: 'Offer',
				deployName: 'prod',
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
				const pushMock = jest.fn()

				const event = new DataLayer({ push: pushMock }).pageChange(fields)

				expect(warn).toHaveBeenCalledTimes(1)
				expect(warn).toHaveBeenCalledWith(
					'pageChange needs a route or a templateName',
				)
				expect(pushMock).not.toHaveBeenCalled()
				expect(event).toBeUndefined()
			},
		)

		it('should ignore values that are not strings', () => {
			const pushMock = jest.fn()

			const event = new DataLayer({ push: pushMock }).pageChange({
				route: 42,
				templateName: 'Offer',
			})

			expect(event).toStrictEqual({
				event: 'pageChange',
				templateName: 'Offer',
			})
			expect(pushMock).toHaveBeenCalledTimes(1)
			expect(pushMock).toHaveBeenCalledWith({
				event: 'pageChange',
				templateName: 'Offer',
			})
		})
	})
})
