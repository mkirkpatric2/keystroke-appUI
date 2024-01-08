import {sizes} from './keyboardData.js';

export const classes = (size, x) => {
	const numTimesOverThirty = Math.floor( Number(x) / 30);
	if (numTimesOverThirty >= 1) {
		x = x - (30 * numTimesOverThirty);
	}
	return ['key', `c-${x}`, size];
};

export const createKeys = (style = "_distinct") => {
	const frag = document.createDocumentFragment();
	const rowTop = document.createElement("span");
	rowTop.classList.add("top");
	frag.appendChild(rowTop)
	for (let key of sizes) {
		const keySpan = document.createElement('span');
		keySpan.classList.add(...classes(key.size, key.i), style);
		keySpan.id = key.char;
		keySpan.textContent = key.char;
		if (key.i === sizes.length) {
			keySpan.classList.add('lastRow');
			for (let lastKey of key.children) {
				const lastRowKey = document.createElement('span');
				lastRowKey.classList.add('key', lastKey.i === 4 && 'space');
				lastRowKey.id = lastKey.char;
				lastRowKey.textContent = lastKey.char;
				keySpan.appendChild(lastRowKey);
			}
		}
		frag.appendChild(keySpan);
	}
	return frag;
}