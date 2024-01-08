// const clickAudio = new Audio('/assets/click2.mp3');
// const clickAudio2 = new Audio('/assets/click2.mp3');
// const clickAudio3 = new Audio('/assets/click2.mp3');
// const clickAudio4 = new Audio('/assets/click2.mp3');
// clickAudio.playbackRate = 2.0;
// clickAudio2.playbackRate = 2.0;
// clickAudio3.playbackRate = 2.0;
// clickAudio4.playbackRate = 2.0;
// const audioContext = new AudioContext();
// const audioStream = audioContext.createBufferSource(
// 	audioContext.decodeAudioData(
// 		new ArrayBuffer(await fetch('/assets/click2.mp3')),
// 		buffer => {
// 			audioStream.buffer = buffer;
// 			audioStream.connect(audioContext.destination);
// 		},
// 	),
// );
//
// function stop(source) {
// 	source.stop(audioContext.currentTime);
// }
// function start(source) {
// 	source.start(audioContext.currentTime);
// }
// export default function keyboardEventListeners() {
// 	const animationsStart = [];
// 	const animationsEnd = [];
//
// 	const audioCounter = {count: 0};
// 	clickAudio.onended = () => {
// 		audioCounter.count -= 1;
// 		console.log(audioCounter);
// 	};
// 	clickAudio.onplay = () => {
// 		audioCounter.count += 1;
// 		console.log(audioCounter);
// 	};
// 	clickAudio2.onended = () => {
// 		audioCounter.count -= 1;
// 		console.log(audioCounter);
// 	};
// 	clickAudio2.onplay = () => {
// 		audioCounter.count += 1;
// 		console.log(audioCounter);
// 	};
// 	clickAudio3.onended = () => {
// 		audioCounter.count -= 1;
// 		console.log(audioCounter);
// 	};
// 	clickAudio3.onplay = () => {
// 		audioCounter.count += 1;
// 		console.log(audioCounter);
// 	};
// 	clickAudio4.onended = () => {
// 		audioCounter.count -= 1;
// 		console.log(audioCounter);
// 	};
// 	clickAudio4.onplay = () => {
// 		audioCounter.count += 1;
// 		console.log(audioCounter);
// 	};
// 	window.addEventListener('keydown', e => {
// 		if (e.key.match(/^[a-zA-Z]$/)) {
// 			const isCurrent = animationsStart.find(ani => ani.key === e.key);
// 			// clickAudioBtn.playbackRate = 5;
// 			if (isCurrent) {
// 				cancelAnimationFrame(isCurrent.id);
// 			}
// 			if (audioCounter > 0) {
// 				if (audioCounter.count === 1) {
// 					clickAudio2.play();
// 				}
// 				if (audioCounter.count === 2) {
// 					clickAudio3.play();
// 				}
// 				if (audioCounter.count === 2) {
// 					clickAudio3.play();
// 				}
// 			} else {
// 				clickAudio.play();
// 			}
// 			animationsStart.push({
// 				id: requestAnimationFrame(() => {
// 					console.log(e.key.toLowerCase());
// 					const key = document.getElementById(e.key.toLowerCase());
// 					key.classList.add('pressed');
// 				}),
// 				key: e.key,
// 			});
// 		}
// 	});
// 	window.addEventListener('keyup', e => {
// 		const isCurrent = animationsEnd.find(ani => ani.key === e.key);
// 		if (isCurrent) {
// 			cancelAnimationFrame(isCurrent.id);
// 		}
// 		if (e.key.match(/^[a-zA-Z]$/)) {
// 			animationsEnd.push({
// 				id: requestAnimationFrame(() => {
// 					console.log(e.key.toLowerCase());
// 					const key = document.getElementById(e.key.toLowerCase());
// 					key.classList.remove('pressed');
// 				}),
// 				key: e.key,
// 			});
// 		}
// 	});
// }
