/** Base class for state machine states to inherit from with placeholder implementations. */
export default class State {
    /** 
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        this.stateMachine = stateMachine;
    }

    /**
     * Called once per frame by the state machine to update game logic.
     * @param {Number} dt How much time has elapsed since the last time this was called.
     */
    update(dt) { }

    /** Called once per frame by the state machine to update the canvas. */
    render() { }
}