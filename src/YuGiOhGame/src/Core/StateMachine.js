import LoadingState from "../States/LoadingState.js";
import RenderSystem from "./RenderSytem.js";
import { canvas, ctx } from "../globals.js";

/** Basic state machine which tracks the current game state and owns the rendering system. */
export default class StateMachine {
	constructor() {
        this.renderer = new RenderSystem(canvas, ctx);
        this.currentState = new LoadingState(this);
	}

    update(dt) {
		this.currentState.update(dt);
	}

    render() {
        this.renderer.clear();
        this.currentState.render();
    }
}