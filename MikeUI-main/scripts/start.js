import {allEnvs} from '../config/webpackHelpers.js';
const isProd = allEnvs.raw.APP_ENV === 'production';
const isDev = allEnvs.raw.APP_ENV === 'development';
const isProfile = allEnvs.raw.APP_ENV === 'profile';
const NoEmitEslintError = allEnvs.raw.NOT_EMIT_ESLINT_DEV_ERRORS === true;
const shouldUseSourceMaps = allEnvs.raw.SOURCEMAPS === true;
import configFactory from '../webpack.config.js';
import {devServer} from '../webpackDevServer.config.js';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import chalk from 'chalk';

//created from webpack config -- we import devServerConfig above
const devCompilerConfig = configFactory({
	isProd,
	isDev,
	isProfile,
	shouldUseSourceMaps,
	NoEmitEslintError,
});
const compiler = webpack(devCompilerConfig);
const webpackDevServer = new WebpackDevServer(devServer, compiler);
const runServer = async () => {
	console.log(chalk.blue('Starting Company dev server...'));
	await webpackDevServer.start();
};

runServer()
	.then(() => {
		// console.log(chalk.rgb(224, 215, 255));
		console.log('STARTED');
	})
	.catch(err => {
		console.log(chalk.red('Failed to start dev server'));
		console.log(chalk.red.underline(err));
	});
