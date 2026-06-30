import KeyboardHandler from "./KeyboardHandler.js";

/** Supported input types */
const INPUT = ["Keyboard"];

/** Unifies all input types to a simple interface of action states. */
export default class InputManager {
    constructor() {
        this.keyboard = new KeyboardHandler();
        this.currentInput = INPUT.Keyboard;
        this.actionStates = {};
    }

    /** Updates the action states based on input. */
    update() {
        switch (this.currentInput) {
            case INPUT.Keyboard:
                this.actionStates = this.keyboard.getActionStates();
                this.keyboard.update();
                break;
        }
    }

    /** Returns the states of the supported input buttons. */
    get() {
        return this.actionStates;
    }
}