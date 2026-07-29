import { input, renderer } from "../../globals.js";
import Vector from "../Vector.js";
import InputHandler from "./InputHandler.js";
import { InputTypes } from "./InputManager.js";

/** Action State alias for readability */
const CLICKSTATE = InputHandler.ACTIONSTATE;

const LEFTCLICK = "Left";

/** Input handler for mouse input. */
export default class MouseHandler extends InputHandler {
    constructor() {
        super();
        this.mouseStates = {};
        this.cursorPosition = new Vector();
        this.initListeners();
    }

    /** 
     * Updates mouse button down states to mouse button hold states.
     * Also updates mouse button up states to null states.
     * Ensures mouse button down/up state are only present for one frame.
     */
    update() {
        for (const key of Object.keys(this.mouseStates)) {
            if (this.mouseStates[key] === CLICKSTATE.Down) {
                this.mouseStates[key] = CLICKSTATE.Hold;
            } else if (this.mouseStates[key] === CLICKSTATE.Up) {
                this.mouseStates[key] = null;
            }
        }
    }

    /** Adds event listeners for mouse input. */
    initListeners() {
        window.addEventListener('mousemove', this);
        window.addEventListener('mousedown', this);
        window.addEventListener('mouseup', this);
    }

    /**
     * Processes all mouse events.
     * @param {Object} event The event to be processed.
     */
    handleEvent(event) {
        switch (event.type) {
            case 'mousemove':
                this.mouseMoveHandler(event);
                break;
            case 'mousedown':
                this.mouseDownHandler(event);
                break;
            case 'mouseup':
                this.mouseUpHandler(event);
                break;
        }
    }

    /**
     * Registers the mouse move event and updates cursor position.
     * @param {Object} event The mouse move event.
     */
    mouseMoveHandler(event) {
        this.cursorPosition.set(event.clientX, event.clientY);
        if (this.mouseIsInsideCanvas(event)) input.currentInput = InputTypes.Mouse;
    }

    /**
     * Registers the mouse down event for the left button (A action).
     * @param {Object} event The mouse down event.
     */
    mouseDownHandler(event) {
        // Only track left mouse button
        if (event.button !== 0) return;

        const current = this.mouseStates[LEFTCLICK] ?? CLICKSTATE.Up;

        if (current === CLICKSTATE.Up) { 
            this.mouseStates[LEFTCLICK] = CLICKSTATE.Down;
            console.log("Mouse down (left)");
        }
    }

    /**
     * Registers the mouse up event.
     * @param {Object} event The mouse up event.
     */
    mouseUpHandler(event) {
        // Only track left mouse button
        if (event.button !== 0) return;

        this.mouseStates[LEFTCLICK] = CLICKSTATE.Up;
        console.log("Mouse up (left)");
    }

    /** Maps the mouse inputs to standardized action states parsable by the InputManager. */
    getActionStates() {
        const ACTIONS = InputHandler.ACTIONS;
        let states = {};

        if (this.mouseStates[LEFTCLICK]) {
            states[ACTIONS.A] = this.mouseStates[LEFTCLICK];
        }

        return states;
    }

    /**
     * Gets the current position of the cursor/pointer.
     * @returns {Vector} The absolute client coordinates of the mouse pointer.
     */
    getCursorPosition() {
        return this.cursorPosition;
    }

    /**
     * Determines whether the current pointer is within the bounds of the canvas.
     * @param {Event} event The pointer event.
     * @returns True if the pointer is within the canvas bounds.
     */
    mouseIsInsideCanvas(event) {
        const rect = renderer.canvas.getBoundingClientRect();

        return (
            event.clientX >= rect.left &&
            event.clientX < rect.right &&
            event.clientY >= rect.top &&
            event.clientY < rect.bottom
        );
    }
}
