declare const TagManager: {
	dataLayer: (dataLayerArgs: DataLayerArgs) => void
	initialize: (tagManagerArgs: TagManagerArgs) => void
	DataLayer: typeof DataLayer
}

export interface TagManagerArgs {
	/**
	 * The ID of your GTM Container.
	 */
	gtmId: string
	/**
	 * Information that should be added to the dataLayer before initialization.
	 */
	dataLayer?: Record<string, unknown>
	/**
	 * Customize the name of the dataLayer object.
	 */
	dataLayerName?: string
	/**
	 * Additional events which will be added to the dataLayer during initialization.
	 */
	events?: Array<Record<string, unknown>>
	/**
	 * If you use GTM's environment function, you need to pass the gtm_auth query parameter here.
	 */
	auth?: string
	/**
	 * If you use GTM's environment function, you need to pass the gtm_preview query parameter here.
	 */
	preview?: string
	/**
	 * Set the nonce [if you use the Google Tag Manager with a Content Security Policy](https://developers.google.com/tag-platform/security/guides/csp).
	 */
	nonce?: string
	/**
	 * Customize the GTM script URL [if you serve the script through your tagging servers](https://developers.google.com/tag-platform/tag-manager/server-side/dependency-serving?tag=gtm) or want to mask your GTM script.
	 */
	source?: string
}

export interface DataLayerArgs {
	/**
	 * Object that contains all of the information that you want to pass to Google Tag Manager.
	 */
	dataLayer?: Record<string, unknown>
	/**
	 * Custom name for dataLayer object.
	 */
	dataLayerName?: string
}

export type PageChangeTarget =
	| { route: string; templateName?: string }
	| { route?: string; templateName: string }

export type PageChangeFields = PageChangeTarget & {
	/**
	 * Overrides the deployment name given to the constructor.
	 */
	deployName?: string
}

export type PageChangeEvent = { event: 'pageChange' } & PageChangeFields

export type DataLayerOptions = {
	/**
	 * Name of the dataLayer array on `window`, used by the default transport.
	 */
	dataLayerName?: string
	/**
	 * Deployment name added to every event unless the call overrides it.
	 */
	deployName?: string
	/**
	 * Transport that receives each built event instead of the default push.
	 */
	push?: (event: PageChangeEvent) => void
}

/**
 * Pushes the events shared by every frontend that reports to the common
 * GTM container. By default an instance pushes to `window[dataLayerName]`
 * through `TagManager.dataLayer`; pass `push` to route the events through
 * your own gate (feature flag, Consent Mode, queueing).
 *
 * @param options Optional settings: `dataLayerName` (default `'dataLayer'`) for the default transport, `deployName` added to every event unless the call overrides it, and `push` that receives each built event instead of the default push.
 * @example
 * const dataLayer = new DataLayer({ deployName: 'prod' })
 * dataLayer.pageChange({ route: '/oferta', templateName: 'Offer' })
 * @example
 * const dataLayer = new DataLayer({ push: (event) => trackEvent(event) })
 */
export declare class DataLayer {
	constructor(options?: DataLayerOptions)
	/**
	 * Builds and pushes the `pageChange` event. Empty and missing fields are
	 * left out of the event, because `undefined` clears the variable in the
	 * GTM data model. At least one of `route` and `templateName` is required.
	 *
	 * @param fields `route` is the path of the page, for example `'/oferta'`; `templateName` is the name of the page template, for example `'Offer'`; `deployName` overrides the deployment name given to the constructor.
	 * @returns The pushed event, or `undefined` when neither `route` nor `templateName` is a non-empty string; no event is pushed then.
	 * @example
	 * dataLayer.pageChange({ route: '/oferta', templateName: 'Offer' })
	 * // { event: 'pageChange', route: '/oferta', templateName: 'Offer', deployName: 'prod' }
	 */
	public pageChange(fields: PageChangeFields): PageChangeEvent | undefined
}

export default TagManager
