import KeyboardHandler from "./KeyboardHandler.js";
import MouseHandler from "./MouseHandler.js";
import TapHandler from "./TapHandler.js";

/** Supported input types */
export const InputTypes = {
    Keyboard: "Keyboard",
    Mouse: "Mouse",
    Tap: "Tap"
};

/** Unifies all input types to a simple interface of action states. */
export default class InputManager {
    constructor() {
        this.keyboard = new KeyboardHandler();
        this.mouse = new MouseHandler();
        this.tap = new TapHandler();
        this.currentInput = InputTypes.Mouse;
        this.actionStates = {};

        this.handlers = [
            { type: InputTypes.Keyboard, handler: this.keyboard },
            { type: InputTypes.Mouse, handler: this.mouse },
            { type: InputTypes.Tap, handler: this.tap },
        ];
    }

    /** Updates the action states based on input. */
    update() {
        this.actionStates = {};

        for (const { type, handler } of this.handlers) {
            // Get the last state of the input handler
            const states = handler.getActionStates();

            // Changes the input based on the latest input type received.
            if (Object.values(states).some(value => value !== null)) {
                this.currentInput = type;
                this.actionStates = states;
            }

            // Update the input handler once everything else has been processed.
            handler.update();
        }
    }

    /**
     * Gets the current state of the input.
     * @returns {Object} An object representing the states of each supported input button.
     */
    get() {
        return this.actionStates;
    }

    /**
     * Gets the position of the current input pointer (mouse or tap).
     * @returns {Vector} The pointer's coordinates, if the current input is a pointer type (null otherwise).
     */
    getPointerPosition() {
        if (this.currentInput === InputTypes.Mouse) return this.mouse.getCursorPosition();
        else if (this.currentInput === InputTypes.Tap) return this.tap.getTouchPosition();
        else return null;
    }
}