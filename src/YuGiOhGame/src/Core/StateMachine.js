import LoadingState from "../States/LoadingState.js";
import { renderer, input } from "../globals.js";

/** Basic state machine which tracks the current game state and owns the rendering system. */
export default class StateMachine {
	constructor() {
        this.currentState = new LoadingState(this);
	}

    /** Updates the input and the current state. */
    update(dt) {
        input.update();
		this.currentState.update(dt);
	}

    /** Renders the current state. */
    render() {
        renderer.clear();
        this.currentState.render();
    }
}