import TitleScreenState from "./TitleScreenState.js";
import State from "../Core/State.js";
import { CANVAS_HEIGHT } from "../globals.js";

/** State for loading screens with basic progress display. */
export default class LoadingState extends State {
    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super(stateMachine);
        this.displayMsg = null;
        this.timer = 0;
    }

    update(dt) {
        // Force half a second of loading time because it's too fast otherwise.
        const MIN_LOAD_TIME = 0.5;
        this.timer += dt;

        if (this.renderer.ready) {
            if (this.timer >= MIN_LOAD_TIME) {
                this.stateMachine.currentState = new TitleScreenState(this.stateMachine);
            }
        }

        this.displayMsg = `LOADING IMAGE ASSETS ${this.renderer.assetsLoaded} / ${this.renderer.assetsTotal}`;
	}

    render() {
        this.renderer.background("black");
        this.renderer.headerText(this.displayMsg, CANVAS_HEIGHT / 2);
    }
}