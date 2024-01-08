import Control from './control.js';
let context;
let control;


export default async function setupListeners() {
	const animationsStart = [];
	const animationsEnd = [];
	const isPressed = [];
	const url = '/post'

	window.addEventListener('keydown', async e => {
		if (!context) {
			context = new AudioContext();
			control = await new Control(context);
		}
		if (e.key.match(/^[a-zA-Z]$/)) {
			
			console.log(e)
			const toSend = {'key':`${e.key}, ${e.timeStamp}, ${e.shiftKey}, ${e.altKey}, ${e.ctrlKey}`}
			// Structure event pre-emptively for csv format
		


			await fetch(url, {
				headers: {
					"Content-Type": "application/json",
				},
				body:JSON.stringify(toSend), 
				method:"POST"
			})

			const isCurrent = animationsStart.find(ani => ani.key === e.key);
			// clickAudioBtn.playbackRate = 5;
			if (isCurrent) {
				cancelAnimationFrame(isCurrent.id);
			}
			if (!isPressed.includes(e.key)) {
				control.play();
				isPressed.push(e.key);
			}
			console.log(isPressed);
			// await audio.play();
			animationsStart.push({
				id: requestAnimationFrame(() => {
					console.log(e.key.toLowerCase());
					const key = document.getElementById(e.key.toLowerCase());
					key.classList.add('pressed');
				}),
				key: e.key,			
			});
		}
	});
	window.addEventListener('keyup', e => {
		const isCurrent = animationsEnd.find(ani => ani.key === e.key);
		if (isCurrent) {
			cancelAnimationFrame(isCurrent.id);
		}
		if (isPressed.includes(e.key)) {
			isPressed.splice(isPressed.indexOf(e.key), 1);
		}
		console.log(isPressed);
		if (e.key.match(/^[a-zA-Z]$/)) {
			animationsEnd.push({
				id: requestAnimationFrame(() => {
					console.log(e.key.toLowerCase());
					const key = document.getElementById(e.key.toLowerCase());
					key.classList.remove('pressed');
				}),
				key: e.key,
			});
		}
	});
}
