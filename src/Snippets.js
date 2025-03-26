// https://developers.google.com/tag-manager/quickstart

const Snippets = {
	tags: function ({
		id,
		events,
		dataLayer,
		dataLayerName,
		preview = undefined,
		auth = undefined,
		nonce = undefined,
		source,
	}) {
		const environment =
			auth && preview
				? `&gtm_auth=${auth}&gtm_preview=${preview}&gtm_cookies_win=x`
				: ''

		const script = `
			(function(w,d,s,l,i){w[l]=w[l]||[];
				w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'}${
					events.length > 0
						? ',' + JSON.stringify(events).slice(1, -1)
						: ''
				});
				var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
				j.async=true;
				j.src='${source}?id='+i+dl+'${environment}';
				${nonce ? `j.setAttribute('nonce','${nonce}');` : ''}
				f.parentNode.insertBefore(j,f);
			})(window,document,'script','${dataLayerName}','${id}');`

		const dataLayerVar = this.dataLayer(dataLayer, dataLayerName)

		return {
			script,
			dataLayerVar,
		}
	},
	dataLayer: function (dataLayer, dataLayerName) {
		return `
			window.${dataLayerName} = window.${dataLayerName} || [];
			window.${dataLayerName}.push(${JSON.stringify(dataLayer)});`
	},
}

module.exports = Snippets
