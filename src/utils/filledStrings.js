const filledStrings = (fields) =>
	Object.fromEntries(
		Object.entries(fields).filter(
			([, value]) => typeof value === 'string' && value !== '',
		),
	)

module.exports = filledStrings
