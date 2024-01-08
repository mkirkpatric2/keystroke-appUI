import {createKeys} from './keyboardHelpers.js';
export default async function prepareKeyboard() {
	const keyboard = document.createElement('div');
	keyboard.classList.add('keyboard');
	keyboard.appendChild(createKeys('_old'));
	return keyboard;
}
