/** Manages arrays of sounds so that we can play the same sound
 * multiple times repeatedly without having to wait for one sound
 * to be finished playing before playing the same sound again.**/
export default class SoundPool {
	/**
	 * @param {String} source The oject containing the names/paths of the sounds.
	 * @param {Number} size How many times sounds can be played at the same time.
	 */
	constructor(source, enabled, poolSize = 10, volume = 1, loop = false) {
		this.source = source;
		this.poolSize = poolSize;
		this.volume = volume;
		this.loop = loop;
		this.pools = {};
		this.currentSound = 0;

		this.totalAssetsLoaded = 0; // Actual assets * pool size
		this.actualAssetsLoaded = 0;
		this.assetsTotal = 0;
		this.ready = false;

		this.enabled = enabled;

		this.initializePool();
	}

	/** Loads the audio and creates a pool for each sound based on the defined pool size. */
	initializePool() {
		const sounds = Object.entries(this.source);
		this.assetsTotal = sounds.length;

		for (const [name, path] of sounds) {
            this.pools[name] = [];

            for (let i = 0; i < this.poolSize; i++) {    
                const audio = new Audio(path);

				audio.addEventListener("canplaythrough", this.onLoaded.bind(this), { once: true });

                audio.volume = this.volume;
                audio.loop = this.loop;

                this.pools[name].push(audio);
            }
		}
	}

	/**
	 * Checks if the currentSound is ready to play, plays the sound,
	 * then increments the currentSound counter.
	 * @param {String} soundName The enum string identifying the sound to play.
	*/
	play(soundName) {
		if (!this.enabled) return;
		
		if (this.pools[soundName][this.currentSound].currentTime === 0
			|| this.pools[soundName][this.currentSound].ended
			|| this.pools[soundName][this.currentSound].paused) {
			this.pools[soundName][this.currentSound].play();
		}

		this.currentSound = (this.currentSound + 1) % this.poolSize;
	}

	/** Counts assets loaded and emits ready signal when all assets are loaded. */
	onLoaded(event) {
		const audio = event.currentTarget;
		this.totalAssetsLoaded++;
		this.actualAssetsLoaded = Math.floor(this.totalAssetsLoaded / this.poolSize);
		this.ready = (this.actualAssetsLoaded === this.assetsTotal);
	}
}