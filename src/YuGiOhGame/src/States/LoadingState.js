import TitleScreenState from "./TitleScreenState.js";
import State from "../Core/State.js";
import { CANVAS_HEIGHT } from "../Core/RenderSytem.js"
import { renderer } from "../globals.js";

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

    /** Updates the display message to output the number of assets loaded. */
    update(dt) {
        // Force half a second of loading time because it's too fast otherwise.
        const MIN_LOAD_TIME = 0.5;
        this.timer += dt;

        if (renderer.ready) {
            if (this.timer >= MIN_LOAD_TIME) {
                this.stateMachine.currentState = new TitleScreenState(this.stateMachine);
            }
        }

        this.displayMsg = `LOADING IMAGE ASSETS ${renderer.assetsLoaded} / ${renderer.assetsTotal}`;
	}

    /** Displays the number of assets loaded. */
    render() {
        renderer.background("black");
        renderer.headerText(this.displayMsg, CANVAS_HEIGHT / 2);
    }
}