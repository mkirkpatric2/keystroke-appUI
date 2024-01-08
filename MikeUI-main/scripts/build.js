import webpack from 'webpack';
import createConfig from '../webpack.config.js';

const config = createConfig({
	isProd: true,
	isDev: false,
	isProfile: false,
	shouldUseSourceMaps: false,
});
const compiler = webpack(config);
try {
	compiler.run();
} catch (e) {
	console.log(e);
}
