import TagManager from './TagManager'
import filledStrings from './utils/filledStrings'
import warn from './utils/warn'

/**
 * Pushes the events shared by every frontend that reports to the common
 * GTM container. By default an instance pushes to `window[dataLayerName]`
 * through `TagManager.dataLayer`; pass `push` to route the events through
 * your own gate (feature flag, Consent Mode, queueing).
 *
 * @param {object} [options]
 * @param {string} [options.dataLayerName='dataLayer'] Name of the dataLayer array on `window`, used by the default transport.
 * @param {string} [options.deployName] Deployment name added to every event unless the call overrides it, for example `'prod'`.
 * @param {(event: object) => void} [options.push] Transport that receives each built event instead of the default push.
 * @example
 * const dataLayer = new DataLayer({ deployName: 'prod' })
 * dataLayer.pageChange({ route: '/oferta', templateName: 'Offer' })
 * @example
 * const dataLayer = new DataLayer({ push: (event) => trackEvent(event) })
 */
class DataLayer {
	static #PAGE_CHANGE_EVENT = 'pageChange'

	constructor({
		dataLayerName = 'dataLayer',
		deployName,
		push = (event) =>
			TagManager.dataLayer({ dataLayer: event, dataLayerName }),
	} = {}) {
		this.deployName = deployName
		this.push = push
	}

	/**
	 * Builds and pushes the `pageChange` event. Empty and missing fields are
	 * left out of the event, because `undefined` clears the variable in the
	 * GTM data model. At least one of `route` and `templateName` is required.
	 *
	 * @param {object} fields
	 * @param {string} [fields.route] Path of the page, for example `'/oferta'`.
	 * @param {string} [fields.templateName] Name of the page template, for example `'Offer'`.
	 * @param {string} [fields.deployName] Overrides the deployment name given to the constructor.
	 * @returns {object | undefined} The pushed event, or `undefined` when neither `route` nor `templateName` is a non-empty string; no event is pushed then.
	 * @example
	 * dataLayer.pageChange({ route: '/oferta', templateName: 'Offer' })
	 * // { event: 'pageChange', route: '/oferta', templateName: 'Offer', deployName: 'prod' }
	 */
	pageChange({ route, templateName, deployName = this.deployName } = {}) {
		const fields = filledStrings({ route, templateName, deployName })
		const hasTarget = Boolean(fields.route || fields.templateName)

		if (!hasTarget) {
			warn('pageChange needs a route or a templateName')

			return undefined
		}

		const event = { event: DataLayer.#PAGE_CHANGE_EVENT, ...fields }

		this.push(event)

		return event
	}
}

module.exports = DataLayer
