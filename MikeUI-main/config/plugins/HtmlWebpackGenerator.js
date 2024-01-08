import HtmlWebpackPlugin from 'html-webpack-plugin';
const prodHtmlSettings = {
	minify: {
		removeComments: true,
		collapseWhitespace: true,
		removeRedundantAttributes: true,
		useShortDoctype: true,
		removeEmptyAttributes: true,
		removeStyleLinkTypeAttributes: true,
		keepClosingSlash: true,
		minifyJS: true,
		minifyCSS: true,
		minifyURLs: true,
	},
};

const defaultHtmlSettings = (page, defaultTemplate, isProd) => {
	return {
		inject: true,
		filename: `${page}.html`,
		chunks: [page],
		template: defaultTemplate,
		title: `${page}-demo`,
		...(isProd ? prodHtmlSettings : {}),
	};
};

const htmlPluginGenerator = (pages, defaultTemplate, isProd) =>
	pages.map(
		page =>
			new HtmlWebpackPlugin(defaultHtmlSettings(page, defaultTemplate, isProd)),
	);
export default htmlPluginGenerator;
