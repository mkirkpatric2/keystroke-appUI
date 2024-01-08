// const friendlySyntaxErrorLabel = 'Syntax error:';
// function isLikelyASyntaxError(message) {
// 	return message.indexOf(friendlySyntaxErrorLabel) !== -1;
// }
//
// /**
//  * Function constructor which takes the webpack message we want to display then formats it so we get a clean and
//  * orderly message to work with.
//  * @param message webpack message we want to format
//  * @constructor
//  */
// function EvFormatter(message) {
// 	// Let's initialise our message and lines
// 	this.message = message;
// 	this.lines = [];
// }
//
// EvFormatter.prototype.splitMessage = function (message) {
// 	if (typeof message === 'string') {
// 		this.lines = message.split('\n');
// 	} else if ('message' in message) {
// 		this.lines = message['message'].split('\n');
// 	} else if (Array.isArray(message)) {
// 		message.forEach(message => {
// 			if ('message' in message) {
// 				this.lines = message['message'].split('\n');
// 			}
// 		});
// 	}
// 	return this;
// };
//
// EvFormatter.prototype.checkForParsingError = function () {
// 	this.lines
// 		.filter(line => !/Module [A-z ]+\(from/.test(line))
// 		.map(line => {
// 			const parsingError = /Line (\d+):(?:(\d+):)?\s*Parsing error: (.+)$/.exec(
// 				line,
// 			);
// 			if (!parsingError) return line;
// 			//ignore the first item returned when destructuring the error
// 			// eslint-disable-next-line no-unused-vars
// 			const [__ignore, errorLine, errorColumn, errorMessage] = parsingError;
// 			return `${friendlySyntaxErrorLabel} ${errorMessage} (${errorLine}:${errorColumn})`;
// 		});
// 	return this;
// };
//
// EvFormatter.prototype.checkForCssErr = function () {
// 	this.lines
// 		.join('\n')
// 		.replace(
// 			/SyntaxError\s+\((\d+):(\d+)\)\s*(.+?)\n/g,
// 			`${friendlySyntaxErrorLabel} $3 ($1:$2)\n`,
// 		);
// 	return this;
// };
//
// EvFormatter.prototype.replaceExportErrors = function () {
// 	const errorPatterns = [
// 		{
// 			regex: /^.*export '(.+?)' was not found in '(.+?)'.*$/gm,
// 			replacement: `Attempted import error: '$1' is not exported from '$2'.`,
// 		},
// 		{
// 			regex:
// 				/^.*export 'default' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
// 			replacement: `Attempted import error: '$2' does not contain a default export (imported as '$1').`,
// 		},
// 		{
// 			regex:
// 				/^.*export '(.+?)' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
// 			replacement: `Attempted import error: '$1' is not exported from '$3' (imported as '$2').`,
// 		},
// 	];
// 	errorPatterns.forEach(pattern => {
// 		this.val = this.val.replace(pattern.regex, pattern.replacement);
// 	});
// 	return this;
// };
//
// // Handler functions for lines
// EvFormatter.prototype.splitIntoLines = function () {
// 	this.val = this.val.split('\n');
// 	return this;
// };
//
// EvFormatter.prototype.removeLeadingNewline = function () {
// 	if (this.val.length > 2 && this.val[1].trim() === '') {
// 		this.val.splice(1, 1);
// 	}
// 	return this;
// };
//
// EvFormatter.prototype.cleanupFileName = function (lines) {
// 	this.val = lines[0].replace(/^(.*) \d+:\d+-\d+$/, '$1');
// 	return this;
// };
// EvFormatter.prototype.cleanupModuleNotFoundMessage = function () {
// 	if (this.val[1] && this.val[1].indexOf('Module not found: ') === 0) {
// 		this.val = [
// 			this.val[0],
// 			this.val[1]
// 				.replace('Error: ', '')
// 				.replace('Module not found: Cannot find file:', 'Cannot find file:'),
// 		];
// 	}
// 	return this;
// };
//
// EvFormatter.prototype.addHelpForSass = function () {
// 	if (this.val[1] && this.val[1].match(/Cannot find module.+sass/)) {
// 		this.val[1] = 'To import Sass files, you first need to install sass.\n';
// 		this.val[1] +=
// 			'Run `npm install sass` or `yarn add sass` inside your workspace.';
// 	}
// 	return this;
// };
//
// EvFormatter.prototype.joinLinesIntoMessage = function () {
// 	if (this.val[1] && this.val[1].match(/Cannot find module.+sass/)) {
// 		this.val[1] = ```
// 			You first need to install sass.\n
// 			If you just ran an 'npm install' and are seeing this message\n
// 			please reach out to me.
// 			```;
// 	}
// 	return this;
// };
//
// EvFormatter.prototype.replaceInternalStacks = function () {
// 	this.val = this.val.replace(
// 		/^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm,
// 		'',
// 	);
// 	this.val = this.val.replace(/^\s*at\s<anonymous>(\n|$)/gm, ''); // at <anonymous>
// 	return this;
// };
//
// /** @return {*[]}  */
// EvFormatter.prototype.removeDuplicateNewlines = function () {
// 	// Remove duplicated newlines
// 	return this.val.filter(
// 		(line, index, arr) =>
// 			index === 0 ||
// 			line.trim() !== '' ||
// 			line.trim() !== arr[index - 1].trim(),
// 	);
// };
//
// /** @returns {*[]} */
// EvFormatter.prototype.format = function (message) {
// 	this.val = message;
// 	return this.splitMessage()
// 		.checkForParsingError()
// 		.checkForCssErr()
// 		.replaceExportErrors()
// 		.splitIntoLines()
// 		.removeLeadingNewline()
// 		.cleanupFileName()
// 		.cleanupModuleNotFoundMessage()
// 		.addHelpForSass()
// 		.joinLinesIntoMessage()
// 		.replaceInternalStacks()
// 		.removeDuplicateNewlines();
// };
//
// /**
//  * Formats a message and returns the formatted message along with the formatter
//  * @param {{errors: string[], warnings: string[]}} json
//  * @returns {{formatter: EvFormatter, first: {warnings: any[], errors: any[]}}}
//  */
// export default function initMessageFormatter(json) {
// 	const formatter = new EvFormatter();
// 	const formattedErrors = json.errors.map(formatter.format);
// 	const formattedWarnings = json.warnings.map(formatter.format);
// 	const result = {errors: formattedErrors, warnings: formattedWarnings};
// 	if (result.errors.some(isLikelyASyntaxError)) {
// 		// If there are any syntax errors, show just them.
// 		result.errors = result.errors.filter(isLikelyASyntaxError);
// 	}
// 	return {first: result, formatter};
// }
