import {webpackFuncs} from '../webpackHelpers.js';

class InterpolateHtmlPlugin {
	constructor(htmlWebpackPlugin, replacements) {
		this.htmlWebpackPlugin = htmlWebpackPlugin;
		this.replacements = replacements;
	}

	apply(compiler) {
		compiler.hooks.compilation.tap('InterpolateHtmlPlugin', compilation => {
			this.htmlWebpackPlugin
				.getHooks(compilation)
				.afterTemplateExecution.tap('InterpolateHtmlPlugin', data => {
					// Run HTML through a series of user-specified string replacements.
					Object.keys(this.replacements).forEach(key => {
						const value = this.replacements[key];
						data.html = data.html.replace(
							new RegExp('%' + webpackFuncs.escapeStringRegexp(key) + '%', 'g'),
							value,
						);
					});
				});
		});
	}
}

export default InterpolateHtmlPlugin;
