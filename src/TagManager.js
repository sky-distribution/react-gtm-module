import Snippets from './Snippets'
import warn from './utils/warn'

const TagManager = {
	dataScript: function (dataLayer, dataLayerName, nonce) {
		const script = document.createElement('script')
		script.innerHTML = dataLayer
		script.setAttribute('data-testid', dataLayerName)
		if (nonce) {
			script.setAttribute('nonce', nonce)
		}
		return script
	},
	gtm: function (args) {
		const snippets = Snippets.tags(args)

		const script = () => {
			const script = document.createElement('script')
			script.setAttribute('data-testid', 'gtm')
			script.innerHTML = snippets.script
			if (args.nonce) {
				script.setAttribute('nonce', args.nonce)
			}
			return script
		}

		const dataScript = this.dataScript(snippets.dataLayerVar, args.dataLayerName, args.nonce)

		return {
			script,
			dataScript,
		}
	},
	initialize: function ({
		gtmId,
		events = [],
		dataLayer = undefined,
		dataLayerName = 'dataLayer',
		auth = undefined,
		preview = undefined,
		nonce = undefined,
		source = 'https://googletagmanager.com/gtm.js',
	}) {
		if (!gtmId) {
			warn('GTM Id is required')
			return
		}
		const gtm = this.gtm({
			id: gtmId,
			events,
			dataLayer,
			dataLayerName,
			auth,
			preview,
			nonce,
			source,
		})
		if (dataLayer) document.head.appendChild(gtm.dataScript)
		document.head.insertBefore(gtm.script(), document.head.childNodes[0])
	},
	dataLayer: function ({ dataLayer, dataLayerName = 'dataLayer' }) {
		if (window[dataLayerName]) return window[dataLayerName].push(dataLayer)
		const snippets = Snippets.dataLayer(dataLayer, dataLayerName)
		const dataScript = this.dataScript(snippets, dataLayerName)
		document.head.insertBefore(dataScript, document.head.childNodes[0])
	},
}

module.exports = TagManager
