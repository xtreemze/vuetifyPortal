module.exports = {
	publicPath: process.env.NODE_ENV === 'production'
		? '/vuetifyPortal/'
		: '/',

	lintOnSave: true,

	pwa: {
		name: "Customer portal"
	},

	baseUrl: '/vuetifyPortal/',
	outputDir: undefined,
	assetsDir: undefined,
	runtimeCompiler: undefined,
	productionSourceMap: undefined,
	parallel: undefined,
	css: undefined
};
