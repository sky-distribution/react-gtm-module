describe('index', () => {
	it('should expose initialize and dataLayer on the default export', () => {
		const TagManager = require('../index')

		expect(TagManager.initialize).toBeInstanceOf(Function)
		expect(TagManager.dataLayer).toBeInstanceOf(Function)
	})

	it('should expose the DataLayer class as a property of the default export', () => {
		const TagManager = require('../index')
		const DataLayer = require('../DataLayer')

		expect(TagManager.DataLayer).toBe(DataLayer)
	})
})
