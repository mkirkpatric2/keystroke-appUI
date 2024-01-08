import {createHash} from 'crypto';
import fs from 'fs';
import path from 'path';
const appDirectory = fs.realpathSync(process.cwd());

function escapeStringRegexp(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

const createEnvHash = env => {
	const hash = createHash('sha256');
	hash.update(JSON.stringify(env));

	return hash.digest('hex');
};

const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const moduleFileExtensions = ['.mjs', '.js', 'jsx', '.json'];
// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
	const extension = moduleFileExtensions.find(extension =>
		fs.existsSync(resolveFn(`${filePath}.${extension}`)),
	);

	if (extension) {
		return resolveFn(`${filePath}.${extension}`);
	}

	return resolveFn(`${filePath}.js`);
};

const filesToIgnore = src =>
	new RegExp(
		`^(?!${escapeStringRegexp(
			path.normalize(src + '/').replace(/\\+/g, '/'),
		)}).+/node_modules/`,
		'g',
	);

/**
 *
 * @param {string} val
 * @return {undefined|any|string|number|null|string|boolean}
 */
const saveAsTYpe = val => {
	const DATE = 'DATE_';
	if (!isNaN(Number(val))) return Number(val);
	if (val === 'true') return true;
	if (val === 'false') return false;
	if (val === 'undefined') return undefined;
	if (val === 'null') return null;
	if (val.includes('function ') || val.includes('() => '))
		return eval(val) || 'eval of string function was empty';
	if (val.match(/https?:\/\//i)) {
		if (val.endsWith('/')) val = val.slice(0, val.length - 1);
		return val;
	}
	if (val.startsWith(DATE)) {
		return new Date(val.slice(DATE.length));
	}
	return val;
};

const interopFlag = 'USE_LIVE_';
const stringifiedEnv = {};
/**
 * Initializer types
 * @type {{
 * 		PORT: string,
 * 		PUBLIC_URL: string,
 * 		APP_ENV: Mode,
 * 		NODE_ENV: Mode,
 * 		BABEL_ENV: Mode,
 * 		SOURCEMAPS: string,
 * 		NOT_EMIT_ESLINT_DEV_ERRORS: string,
 * 		[key]: string,
 * }}
 */
const rawEnv = Object.keys(process.env)
	.filter(key => key.startsWith('USE_LIVE_'))
	.reduce(
		(newEnv, key) => {
			stringifiedEnv[key.slice(interopFlag.length)] = JSON.stringify(
				process.env[key],
			);
			newEnv[key.slice(interopFlag.length)] = saveAsTYpe(process.env[key]);
			return newEnv;
		},
		{
			PUBLIC_URL: 'https://localhost:8080',
			PORT: '5000',
			APP_ENV: 'production',
			NODE_ENV: 'production',
			BABEL_ENV: 'production',
			SOURCEMAPS: 'false',
			NOT_EMIT_ESLINT_DEV_ERRORS: 'true',
			/** You can add backups/other defaults here, it's technically the initial reduce object.
			 * So this is the initial newEnv above */
		},
	);
export const allEnvs = {
	raw: rawEnv,
	string: stringifiedEnv,
};

export const demoEntries = {
	appIndexJs: resolveModule(resolveApp, 'src/index'),
	appBlockingJs: resolveModule(resolveApp, 'src/blocking'),
	appBusJs: resolveModule(resolveApp, 'src/bus'),
	// appSseJs: resolveModule(resolveApp('src/serverEventsAndBus')),
};

export const appImports = {
	appNodeModules: resolveApp('node_modules'),
	appEslintCache: resolveApp('node_modules/.cache/eslint'),
	appWebpackCache: resolveApp('node_modules/.cache/webpack'),
};

export const appMainFolders = {
	appBuild: resolveApp('build'),
	publicFolder: resolveApp('public'),
	appHtml: resolveApp('public/index.html'),
	appPackageJson: resolveApp('package.json'),
	appSrc: resolveApp('src'),
	appPath: resolveApp('.'),
	appPublicPath: '/', // clicked through thei script
};

export const webpackFuncs = {
	createEnvHash,
	moduleFileExtensions,
	filesToIgnore,
	escapeStringRegexp,
};
