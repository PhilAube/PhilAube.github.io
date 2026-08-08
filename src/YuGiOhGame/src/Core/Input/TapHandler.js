import Vector from "../Vector.js";
import InputHandler from "./InputHandler.js";

/** Action State alias for readability */
const TAPSTATE = InputHandler.ACTIONSTATE;

const TAP = "Tap";

/** Input handler for touch input. */
export default class TapHandler extends InputHandler {
    constructor() {
        super();
        this.touchStates = {};
        this.touchPosition = new Vector();
        this.initListeners();
    }

    /** 
     * Updates touch down states to touch hold states. 
     * Also updates touch up states to null states.
     * Ensures touch down/up state are only present for one frame.
     */
    update(dt) {
        for (const key of Object.keys(this.touchStates)) {
            if (this.touchStates[key] === TAPSTATE.Down) {
                this.touchStates[key] = TAPSTATE.Hold;
            } else if (this.touchStates[key] === TAPSTATE.Up) {
                this.touchStates[key] = null;
            }
        }

        this.decayGestureVelocity(dt);
    }

    /** Adds event listeners for touch input. */
    initListeners() {
        window.addEventListener('touchstart', this);
        window.addEventListener('touchend', this);
        window.addEventListener('touchmove', this);
    }

    /**
     * Processes all touch events.
     * @param {Object} event The event to be processed.
     */
    handleEvent(event) {
        switch (event.type) {
            case 'touchstart':
                this.touchStartHandler(event);
                break;
            case 'touchend':
                this.touchEndHandler(event);
                break;
            case 'touchmove':
                this.touchMoveHandler(event);
                break;
        }
    }

    /**
     * Registers the touch start event and records position (A action).
     * @param {Object} event The touch start event.
     */
    touchStartHandler(event) {
        if (event.touches.length === 0) return;

        const touch = event.touches[0];
        if (!this.pointerIsInsideCanvas(touch)) return;

        this.touchPosition.set(touch.clientX, touch.clientY);

        const current = this.touchStates[TAP] ?? TAPSTATE.Up;

        if (current === TAPSTATE.Up) {
            this.touchStates[TAP] = TAPSTATE.Down;
            this.beginGesture(touch.clientX, touch.clientY, Date.now());
        }
    }

    /**
     * Registers the touch end event.
     * @param {Object} event The touch end event.
     */
    touchEndHandler(event) {
        this.touchStates[TAP] = TAPSTATE.Up;
        this.finishGesture(this.touchPosition.x, this.touchPosition.y);
    }

    /**
     * Registers the touch move event and updates touch position.
     * @param {Object} event The touch move event.
     */
    touchMoveHandler(event) {
        if (event.touches.length === 0) return;

        const touch = event.touches[0];

        this.touchPosition.set(touch.clientX, touch.clientY);
        this.updateGesture(touch.clientX, touch.clientY, Date.now());
    }

    /** Maps the touch inputs to standardized action states parsable by the InputManager. */
    getActionStates() {
        const ACTIONS = InputHandler.ACTIONS;
        let states = {};

        if (this.touchStates[TAP]) {
            states[ACTIONS.A] = this.touchStates[TAP];
        }

        return states;
    }

    /** Returns the current touch position. */
    getTouchPosition() {
        return this.touchPosition;
    }
}
