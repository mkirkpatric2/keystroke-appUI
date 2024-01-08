import {loadSounds} from './audioSource.js';
const suffix =
	window.navigator?.connection?.downlink > 5
		? '.wav'
		: window.navigator?.connection?.downlink > 1
			? '-med.mp3'
			: '-low.mp3';

console.log(suffix);
function Control(context) {
	const _this = this;
	loadSounds(
		this,
		{
			bufferOne: `/assets/clickOne${suffix}`,
			bufferTwo: `/assets/clickTwo${suffix}`,
			bufferThree: `/assets/clickThree${suffix}`,
			bufferFour: `/assets/clickFour${suffix}`,
			bufferFive: `/assets/clickFive${suffix}`,
			bufferSix: `/assets/clickSix${suffix}`,
		},
		context,
		() => {
			console.log('loaded', _this);
		},
	);
	this.buffers = [];
	this.isPlaying = false;
	this.context = context;
}

Control.prototype.play = function () {
	this.gainNode = this.context.createGain();
	this.source = this.context.createBufferSource();
	const idx = Math.floor(Math.random() * 5) + 1;
	console.log(idx);
	if (this.buffers.length) this.source.buffer = this.buffers[idx].buffer;

	// Connect source to a gain node
	this.source.connect(this.gainNode);
	// Connect gain node to destination
	this.gainNode.connect(this.context.destination);
	// Start playback in a loop
	this.source.loop = false;
	this.source[this.source.start ? 'start' : 'noteOn'](0);
};

Control.prototype.stop = function () {
	this.source[this.source.stop ? 'stop' : 'noteOff'](0);
};

Control.prototype.toggle = function () {
	this.isPlaying ? this.stop() : this.play();
	this.isPlaying = !this.isPlaying;
};
export default Control;
