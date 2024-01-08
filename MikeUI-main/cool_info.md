```
terserOptions: {
        ecma: 2020,
        compress: {
        unsafe: false,                  //try this out
        unsafe_methods: false,          //will mangle classes! es6+
        unsafe_proto: false,            //unsafe_proto - Array.prototype.slice.call(a) into [].slice.call(a)
        unsafe_undefined: false,        //substitute void 0 if there is a variable named undefined
        inline: 1,                      //inline simple functions, no args
        module: true,                   //! if I want to compress non-ecma code, create new plugin instance
        passes: 1,                      //pass over code num times. sometimes can help compress
        pure_funcs: null,               //cool one
    },
    mangle: {
        topLevel: false,                //mange top level
        module: false,                  //mangle modules more effectively
    }
}
```

nice terser ideas for the future

```js
// if true, it excludes chunk from optimizations
// we can use to prevent minification.
const opt = {
	optimization: {
		splitChunks: {
			chunks: chunk => returnchunk.name !== 'my-excluded-chunk',
		},
	},
};
```

devtool we can set up a prodlike build that does buid prod with sourcemaps

```javascript
const reactRefreshRuntimeEntry = require.resolve('react-refresh/runtime');
const reactRefreshWebpackPluginRuntimeEntry = require.resolve(
	'@pmmmwh/react-refresh-webpack-plugin',
);
const babelRuntimeEntry = require.resolve('babel-preset-react-app');
const babelRuntimeEntryHelpers = require.resolve(
	'@babel/runtime/helpers/esm/assertThisInitialized',
	{paths: [babelRuntimeEntry]},
);
const babelRuntimeRegenerator = require.resolve('@babel/runtime/regenerator', {
	paths: [babelRuntimeEntry],
});
```

For react
