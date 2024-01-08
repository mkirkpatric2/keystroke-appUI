// if (context.state === 'suspended') {
// 	const overlay = document.getElementById('overlay');
// 	overlay.className = 'visible';
// 	document.addEventListener(
// 		'click',
// 		() => {
// 			context.resume().then(() => {
// 				overlay.className = 'hidden';
// 			});
// 		},
// 		{once: true},
// 	);
// }
//! concept called shimming, we replace the function that may not be supported with an old one we guarantee is.
// window.requestAnimFrame = (function () {
// 	return (
// 		window.requestAnimationFrame ||
// 		window.webkitRequestAnimationFrame ||
// 		window.mozRequestAnimationFrame ||
// 		window.oRequestAnimationFrame ||
// 		window.msRequestAnimationFrame ||
// 		function (callback) {
// 			window.setTimeout(callback, 1000 / 60);
// 		}
// 	);
// })();

export function playSound(context, buffer, time) {
	const source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	source[source.start ? 'start' : 'noteOn'](time);
}

export function loadSounds(parentContext, soundMap, context, callback) {
	const names = [];
	const paths = [];
	for (const name in soundMap) {
		const path = soundMap[name];
		names.push(name);
		paths.push(path);
	}
	const bufferLoader = new BufferLoader(context, paths, function (bufferList) {
		for (let i = 0; i < bufferList.length; i++) {
			const buffer = bufferList[i];
			const name = names[i];
			parentContext.buffers.push({name, buffer});
		}
		if (callback) {
			callback();
		}
	});
	return bufferLoader.load();
}

function BufferLoader(context, urlList, callback) {
	this.context = context;
	this.urlList = urlList;
	this.onload = callback;
	this.bufferList = [];
	this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function (url, index) {
	// Load buffer asynchronously
	const request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	const loader = this;

	request.onload = function () {
		// Asynchronously decode the audio file data in request.response
		// noinspection JSIgnoredPromiseFromCall
		loader.context.decodeAudioData(
			request.response,
			function (buffer) {
				if (!buffer) {
					alert('error decoding file data: ' + url);
					return;
				}
				loader.bufferList[index] = buffer;
				if (++loader.loadCount === loader.urlList.length)
					loader.onload(loader.bufferList);
			},
			function (error) {
				//second call back for the possible error decoding
				console.error('decodeAudioData error', error);
			},
		);
	};

	request.onerror = function (err) {
		console.dir(err);
		alert('BufferLoader: XHR error');
	};

	request.send();
};

BufferLoader.prototype.load = function () {
	for (let i = 0; i < this.urlList.length; ++i)
		this.loadBuffer(this.urlList[i], i);

	return this;
};
