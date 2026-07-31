/** Manages decoded sounds for low-latency playback using the Web Audio API. */
export default class SoundSystem {
	constructor(source, enabled, volume = 1) {
		this.source = source;
		this.enabled = enabled;

		this.context = new AudioContext();

		this.masterGain = this.context.createGain();
		this.masterGain.gain.value = volume;
		this.masterGain.connect(this.context.destination);

		this.buffers = {};

		this.assetsTotal = Object.keys(source).length;
		this.actualAssetsLoaded = 0;
		this.ready = false;

		this.loadSounds();
	}

	/** Fetches and decodes every sound. */
	async loadSounds() {
		for (const [name, path] of Object.entries(this.source)) {
			const response = await fetch(path);
			const arrayBuffer = await response.arrayBuffer();

			this.buffers[name] = await this.context.decodeAudioData(arrayBuffer);

			this.actualAssetsLoaded++;
			this.ready = (this.actualAssetsLoaded === this.assetsTotal);
		}
	}

	/** Plays a decoded sound immediately. */
	play(soundName) {
		if (!this.enabled || !this.ready) return;

		const buffer = this.buffers[soundName];
		if (!buffer) return;

		const source = this.context.createBufferSource();
		source.buffer = buffer;
		source.connect(this.masterGain);
		source.start();
	}
}