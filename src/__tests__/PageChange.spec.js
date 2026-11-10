import { PAGE_CHANGE_EVENT, createPageChangeEvent } from '../PageChange'

describe('PageChange', () => {
	it('should expose the pageChange event name', () => {
		expect(PAGE_CHANGE_EVENT).toBe('pageChange')
	})

	it('should create an event with only route', () => {
		expect(createPageChangeEvent({ route: '/oferta' })).toStrictEqual({ event: 'pageChange', route: '/oferta' })
	})

	it('should create an event with only templateName', () => {
		expect(createPageChangeEvent({ templateName: 'Offer' })).toStrictEqual({
			event: 'pageChange',
			templateName: 'Offer',
		})
	})

	it('should create an event with all fields', () => {
		expect(createPageChangeEvent({ route: '/oferta', templateName: 'Offer', deployName: 'prod' })).toStrictEqual({
			event: 'pageChange',
			route: '/oferta',
			templateName: 'Offer',
			deployName: 'prod',
		})
	})

	it.each([
		{ title: 'an empty string', value: '' },
		{ title: 'undefined', value: undefined },
	])('should omit a field set to $title', ({ value }) => {
		const event = createPageChangeEvent({ route: '/oferta', templateName: value, deployName: value })

		expect(event).not.toHaveProperty('templateName')
		expect(event).not.toHaveProperty('deployName')
		expect(event).toHaveProperty('route', '/oferta')
	})

	it('should keep event first and then route, templateName and deployName in that order', () => {
		const event = createPageChangeEvent({ deployName: 'prod', templateName: 'Offer', route: '/oferta' })

		expect(Object.keys(event)).toStrictEqual(['event', 'route', 'templateName', 'deployName'])
	})
})
