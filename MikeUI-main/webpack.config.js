import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import InlineChunkHtmlPlugin from './config/plugins/InlineHtmlPlugin.js';
import InterpolateHtmlPlugin from './config/plugins/InterpolateHtmlPlugin.js';
import DefinePlugin from './node_modules/webpack/lib/DefinePlugin.js';
import {WebpackManifestPlugin} from 'webpack-manifest-plugin';
import path from 'path';
import htmlPluginGenerator from './config/plugins/HtmlWebpackGenerator.js';
import CopyPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import {
	demoEntries,
	appMainFolders,
	webpackFuncs,
	appImports,
	allEnvs,
} from './config/webpackHelpers.js';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = {
	index: demoEntries.appIndexJs,
	// non_blocking: demoEntries.appIndexJs,
	// blocking: demoEntries.appBlockingJs,
	// sse: path.resolve(__dirname, 'src', 'serverEventsAndBus.js'),
};
const pagesKeys = Object.keys(pages);

/**
 * @param {{isProd: boolean, isDev: boolean, isProfile, shouldUseSourceMaps: boolean}} env
 // * @return {webpack}
 */
export default env => {
	const {isProd, isDev, shouldUseSourceMaps, NoEmitEslintError} = env;
	env = {...env};
	return {
		target: ['browserslist'],
		mode: isProd ? 'production' : 'development',
		bail: isProd,
		stats: 'errors-warnings',
		devtool: isProd ? false : 'cheap-module-source-map',
		entry: pages,
		output: {
			path: `${process.cwd()}/build`,
			asyncChunks: true,
			filename: isProd
				? 'static/js/[name].[contenthash:8].js'
				: 'static/js/[name].bundle.js',
			chunkFilename: isProd
				? 'static/js/[name].[contenthash:8].chunk.js'
				: 'static/js/[name].chunk.js',
			assetModuleFilename: 'static/media/[name].[hash][ext]',
			publicPath: appMainFolders.appPublicPath,
		},
		cache: {
			type: 'filesystem',
			version: webpackFuncs.createEnvHash(env),
			hashAlgorithm: 'sha256',
			cacheDirectory: appImports.appWebpackCache,
			store: 'pack',
			buildDependencies: {
				defaultWebpack: ['webpack/lib/'],
				config: [],
			},
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
				name: isProd ? false : 'dev-build',
			},
			runtimeChunk: {
				name: entrypoint => `runtimechunk-${entrypoint.name}`,
			},
			minimize: isProd,
			minimizer: [
				//if you want to set up multiple chunks with different levels of minification you can with test/include
				new TerserPlugin({
					// test: /\.js(\?.*)?$/i,
					// include: /\/src/,
					// exclude: /\/src\/hidden/,
					terserOptions: {
						ecma: 2020,
						compress: {
							inline: 2, //! if I want to compress non-ecma code, create new plugin instance and
							//! this true
							module: true,
							passes: 1,
						},
						output: {
							comments: false,
						},
					},
				}),
				new CssMinimizerPlugin({
					minimizerOptions: {
						preset: [
							'default',
							{
								discardComments: {removeAll: true},
							},
						],
					},
				}),
			],
		},
		module: {
			parser: {javascript: {exportsPresence: 'error'}},
			rules: [
				shouldUseSourceMaps && {
					enforce: 'pre',
					test: /\.(js|mjs|cjs|jsx|css)$/,
					loader: 'source-map-loader',
				},
				{
					//css is valid sass so we can combine rules
					test: /.s?css$/,
					use: [
						isProd ? MiniCssExtractPlugin.loader : 'style-loader',
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {postcssOptions: {plugins: ['postcss-preset-env']}},
						},
						'sass-loader',
					],
				},
				{
					test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
					type: 'asset/resource',
				},
			].filter(Boolean),
		},
		// resolve: {
		// 	fallback: {
		// 		"fs": false,
		// 		"tls": false,
		// 		"net": false,
		// 		"path": false,
		// 		"zlib": false,
		// 		"http": false,
		// 		"https": false,
		// 		"stream": false,
		// 		"crypto": false,
		// 		"assert": false,
		// 		"util": false,
		// 		"crypto-browserify": 'crypto-browserify', //if you want to use this module also don't forget npm i crypto-browserify 
		// }},
		// extensions: moduleFileExtensions,
		// alias: {
		// 	// Allows for better profiling with ReactDevTools
		// 	...(isProfile && {
		// 		'react-dom$': 'react-dom/profiling',
		// 		'scheduler/tracing': 'scheduler/tracing-profiling',
		// 	}),
		// },
		// plugins: [new ModuleScopePlugin('src', ['package.json'])],
		// maybe the module scoping plugin?
		// },
		infrastructureLogging: {
			level: 'info',
		},
		plugins: [
			...htmlPluginGenerator(pagesKeys, appMainFolders.appHtml, isProd),
			isProd &&
				new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),

			new InterpolateHtmlPlugin(HtmlWebpackPlugin, allEnvs.raw),
			new DefinePlugin(JSON.stringify(allEnvs.raw)),
			new CopyPlugin({
				patterns: [{from: './public/assets/', to: './assets'}],
			}),
			isProd &&
				new MiniCssExtractPlugin({
					filename: 'static/css/[name].[contenthash:8].css',
					chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
				}),
			new WebpackManifestPlugin({
				fileName: 'manifest.json',
				publicPath: appMainFolders.appPublicPath,
				seed: {},
				generate: (seed, files, entrypoints) => {
					const manifestFiles = files.reduce((manifest, file) => {
						const formattedName = file.name;
						manifest[formattedName] = file.path;
						return manifest;
					}, seed);
					return {
						files: manifestFiles,
						entrypoints,
					};
				},
			}),
			//only use if using moment.js -- try something else
			// new IgnorePlugin({
			// 	resourceRegExp: /^\.\/locale$/,
			// 	contextRegExp: /moment$/,
			// }),
			new ESLintPlugin({
				extensions: ['js', 'mjs', 'jsx', 'cjs'], // formatter: require.resolve('react-dev-utils/eslintFormatter'),
				eslintPath: 'eslint',
				failOnError: !(isDev && NoEmitEslintError),
				context: appMainFolders.appSrc,
				cache: true,
				cacheLocation: path.resolve(appImports.appEslintCache),
				cwd: appMainFolders.appPublicPath,
				resolvePluginsRelativeTo: __dirname,
				useEslintrc: true,
			}),
		],
	};
};

// /*@__INLINE__*/ - forces a function to be inlined somewhere.
// /*@__NOINLINE__*/ - Makes sure the called function is not inlined into the call site.
// /*@__PURE__*/ - Marks a function call as pure. That means, it can safely be dropped.
// /*@__KEY__*/ - Marks a string literal as a property to also mangle it when mangling properties.
// /*@__MANGLE_PROP__*/ - Opts-in an object property (or class field) for mangling, when the property mangler is enabled.
