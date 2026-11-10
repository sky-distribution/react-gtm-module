const PAGE_CHANGE_EVENT = 'pageChange'

const isFilledString = (value) => typeof value === 'string' && value !== ''

const createPageChangeEvent = ({ deployName, route, templateName }) => {
	const fields = { route, templateName, deployName }
	const filledFields = Object.fromEntries(Object.entries(fields).filter(([, value]) => isFilledString(value)))

	return { event: PAGE_CHANGE_EVENT, ...filledFields }
}

module.exports = { PAGE_CHANGE_EVENT, createPageChangeEvent }
