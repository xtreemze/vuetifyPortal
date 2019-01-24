module.exports = {
	publicPath: process.env.NODE_ENV === 'production'
		? '/vuetifyPortal/'
		: '/',
	lintOnSave: true,

	pwa: {
		name: "Customer portal"
	}
};
