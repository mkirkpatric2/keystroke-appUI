import './index.scss';
import prepareKeyboard from './keyboard/prepare.js';
import setupListeners from './keyboard/eventListeners2.js';
import setupCounts from './Counts/setupCounts.js';
const mainEl = document.getElementById('root');
async function main() {
	const container = document.createElement('div');
	container.classList.add('container');
	const keyboard = await prepareKeyboard();
	const countDiv = await setupCounts();
	// const gameDiv = await
	container.appendChild(keyboard);
	container.appendChild(countDiv);
	mainEl.appendChild(container);
	await setupListeners();
}
await main();
