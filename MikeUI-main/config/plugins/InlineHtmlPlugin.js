class InlineChunkHtmlPlugin {
	constructor(htmlWebpackPlugin, tests) {
		this.htmlWebpackPlugin = htmlWebpackPlugin;
		this.tests = tests;
	}

	createInlineTag(tag, assets, srcOrHref, publicPath) {
		const scriptName = publicPath
			? srcOrHref.replace(publicPath, '')
			: srcOrHref;
		if (!this.tests.some(test => scriptName.match(test))) {
			return tag;
		}
		const asset = assets[scriptName];
		if (asset == null) {
			return tag;
		}
		return {
			tagName: tag.tagName === 'link' ? 'style' : 'script',
			innerHTML: asset.source(),
			closeTag: true,
		};
	}

	getInlinedTag(publicPath, assets, tag) {
		if (tag.tagName === 'link' && tag?.attributes?.href) {
			return this.createInlineTag(tag, assets, tag.attributes.href, publicPath);
		}
		if (tag.tagName === 'script' && tag?.attributes?.src) {
			return this.createInlineTag(tag, assets, tag.attributes.src);
		}
		return tag;
	}

	apply(compiler) {
		let publicPath = compiler.options.output.publicPath || '';
		if (publicPath && !publicPath.endsWith('/')) {
			publicPath += '/';
		}

		compiler.hooks.compilation.tap('InlineChunkHtmlPlugin', compilation => {
			const tagFunction = tag =>
				this.getInlinedTag(publicPath, compilation.assets, tag);

			const hooks = this.htmlWebpackPlugin.getHooks(compilation);
			hooks.alterAssetTagGroups.tap('InlineChunkHtmlPlugin', assets => {
				assets.headTags = assets.headTags.map(tagFunction);
				assets.bodyTags = assets.bodyTags.map(tagFunction);
			});

			// Still emit the runtime chunk for users who do not use our generated
			// index.html file.
			// hooks.afterEmit.tap('InlineChunkHtmlPlugin', () => {
			//   Object.keys(compilation.assets).forEach(assetName => {
			//     if (this.tests.some(test => assetName.match(test))) {
			//       delete compilation.assets[assetName];
			//     }
			//   });
			// });
		});
	}
}

export default InlineChunkHtmlPlugin;
