/** Base class for input types to implement for an abstracted input interface. */
export default class InputHandler {
    constructor() { }
    /**
     * All input handlers must implement this method.
     * Parses the input and returns an object representing
     * the action state, which informs the input while being
     * implementation-agnostic.
     */
    getActionStates() { }
    
    /** Supported "buttons" or actions */
    static ACTIONS = { 
        Up: "Up",
        Down: "Down",
        Left: "Left",
        Right: "Right",
        A: "A",
        B: "B"
    };

    /** An action can only be in one of these states. */
    static ACTIONSTATE = {
    Down: "Down", // Fired on frame N
    Hold: "Hold", // Fired continuously from frame N+1 until release
    Up: "Up" // Fired once on release
};

    /**
     * Initializes the action states for the input interface.
     * @returns Collection of action states with default state of Up.
     */
    static initActionStates() {
        let states = {};
        Object.keys(InputHandler.ACTIONS).forEach(key => {
            // Buttons are considered unpressed at initializaiton, therefore set to Up.
            states[key] = InputHandler.ACTIONSTATE.Up;
        });
        return states;
    }
}