import {allEnvs, appMainFolders} from './config/webpackHelpers.js';
// /** @type {import('webpack-dev-server')}*/
export const devServer = {
	proxy: {
		'/post': {
			target: 'http://localhost:8888',
			changeOrigin: true,
		},
	},
	port: allEnvs.raw.PORT,
	hot: true,
	// hot: false,
	// liveReload: false,
	static: {
		directory: 'public/assets',
		publicPath: appMainFolders.appPublicPath,
	},
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': '*',
		'Access-Control-Allow-Headers': '*',
	},
	compress: false, //for server side events
	server: 'https',
	historyApiFallback: {
		disableDotRule: true,
		index: '/',
	},
	client: {
		overlay: {
			errors: true,
			warnings: false,
		},
	},
};
