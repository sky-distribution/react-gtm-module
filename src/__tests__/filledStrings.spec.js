import filledStrings from '../utils/filledStrings'

describe('filledStrings', () => {
	it.each([
		{ title: 'an empty string', value: '' },
		{ title: 'an undefined', value: undefined },
		{ title: 'a null', value: null },
		{ title: 'a zero', value: 0 },
		{ title: 'a false', value: false },
	])('should drop $title value', ({ value }) => {
		expect(filledStrings({ route: '/oferta', other: value })).toStrictEqual({
			route: '/oferta',
		})
	})

	it('should keep a non-empty string', () => {
		expect(filledStrings({ route: '/oferta' })).toStrictEqual({
			route: '/oferta',
		})
	})

	it('should keep the input order of the keys', () => {
		const fields = filledStrings({ route: '/oferta', templateName: 'Offer' })

		expect(Object.keys(fields)).toStrictEqual(['route', 'templateName'])
	})

	it('should return an empty object for an empty input', () => {
		expect(filledStrings({})).toStrictEqual({})
	})
})
