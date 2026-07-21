import InputHandler from "./InputHandler.js";

/** Action State alias for readability */
const KEYSTATE = InputHandler.ACTIONSTATE;

/** Input handler for keyboard. */
export default class KeyboardHandler extends InputHandler {
    /** Maps keyboard buttons to action states. */
    static BINDINGS = {
        ArrowUp: InputHandler.ACTIONS.Up,
        ArrowDown: InputHandler.ACTIONS.Down,
        ArrowLeft: InputHandler.ACTIONS.Left,
        ArrowRight: InputHandler.ACTIONS.Right,
        Enter: InputHandler.ACTIONS.A,
        " ": InputHandler.ACTIONS.A,
        Space: InputHandler.ACTIONS.A,
        Backspace: InputHandler.ACTIONS.B
    };

    constructor() {
        super();
        this.keyStates = {};
        this.initListeners();
    }

    /** 
     * Updates key down states to key hold states. 
     * Ensures only key down state is only present for one frame.
     */
    update() {
        for (const key of Object.keys(this.keyStates)) {
            if (this.keyStates[key] === KEYSTATE.Down) {
                this.keyStates[key] = KEYSTATE.Hold;
            }
        }
    }

    /** Adds event listeners for keyboard input. */
    initListeners() {
        // "this" sends the handling to this.handleEvent().
        // It allows us to refer to this.keystates in the key handlers.
        window.addEventListener('keydown', this);
        window.addEventListener('keyup', this);
    }

    /**
     * Processes all key press events.
     * @param {Object} event The event to be processed.
     */
    handleEvent(event) {
        event.preventDefault();

        switch (event.type) {
            case 'keydown':
                this.keyDownHandler(event.key);
                break;
            case 'keyup':
                this.keyUpHandler(event.key);
                break;
        }
    }

    /**
     * Registers the key down event in keyStates.
     * @param {String} key Key sent by the event.
     */
    keyDownHandler(key) {
        // Treat undefined as up
        const current = this.keyStates[key] ?? KEYSTATE.Up;

        if (current === KEYSTATE.Up) { 
            this.keyStates[key] = KEYSTATE.Down;
            console.log(`Key down: ${key}`);
        }
    }

    /**
     * Registers the key up event in keyStates.
     * @param {String} key Key sent by the event.
     */
    keyUpHandler(key) {
        this.keyStates[key] = KEYSTATE.Up;
        console.log(`Key up: ${key}`);
    }

    /** Maps the keyboard inputs to standardized action states parsable by the InputManager. */
    getActionStates() {
        const ACTIONS = InputHandler.ACTIONS;
        let states = {};
        for (const [key, action] of Object.entries(KeyboardHandler.BINDINGS)) {
            if (this.keyStates[key]) {
                states[action] = this.keyStates[key];
            }
        }
        return states;
    }
}