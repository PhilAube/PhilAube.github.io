import RenderSystem from "./RenderSytem.js";

/** Encapsulates the game loop logic for a clean program entry point. */
export default class Game {
	/**
	 * @param {StateMachine} stateMachine
	 */
	constructor(stateMachine) {
		this.stateMachine = stateMachine;
		this.lastTime = 0;
	}

	/** Bootstraps the game loop. */
	start() {
		this.gameLoop();
	}

    /**
	 * This function is the heartbeat of the application. It is called
	 * at the monitor's refresh rate) using the JS requestAnimationFrame() API,
	 * and is used to drive the game's animations.
	 * @param {Number} currentTime How much time has elapsed since the page loaded.
	 */
	gameLoop(currentTime = 0) {
		// Calculates delta time and converts it to seconds instead of milliseconds.
		const deltaTime = (currentTime - this.lastTime) / 1000;

		this.update(deltaTime);
		this.lastTime = currentTime;
		requestAnimationFrame((time) => this.gameLoop(time));
	}

	/**
	 * This function is called by `gameLoop()` at each frame of program execution;
	 * `dt` (i.e., DeltaTime) will be the elapsed time in seconds since the last
	 * frame, and is used to scale any changes in the game for even behavior across frame rates. 
	 * @param {Number} dt How much time has elapsed since the last time this was called.
	 */
	update(dt) {
		// This executes the game logic.
		this.stateMachine.update(dt);
		// Once complete, this draws the updated canvas.
		this.stateMachine.render();
	}
}