import { renderer } from "../../globals.js";
import Vector from "../Vector.js";

const VELOCITY_DECAY_RATE = 8; // How quickly momentum fades while idle.
const VELOCITY_EPSILON = 1; // Minimum velocity before it is treated as settled.
const SMOOTHING_ALPHA = 0.7; // How much of the previous velocity is retained.
const RAW_VELOCITY_WEIGHT = 0.3; // How much of the newest movement sample is applied.

/** Base class for input types to implement for an abstracted input interface. */
export default class InputHandler {
    constructor() {
        this.gestureState = this.createGestureState();
    }

    /**
     * All input handlers must implement this method.
     * Parses the input and returns an object representing
     * the action state, which informs the input while being
     * implementation-agnostic.
     */
    getActionStates() { }

    /**
     * Optional gesture information that can be shared with states for drag logic.
     * @returns {Object|null} Pointer gesture information.
     */
    getGestureState() {
        return this.gestureState;
    }

    /** Creates a reusable gesture state object for pointer drags. */
    createGestureState() {
        return {
            isActive: false,
            isDragging: false,
            startPosition: new Vector(),
            currentPosition: new Vector(),
            lastPosition: new Vector(),
            distanceX: 0,
            distanceY: 0,
            velocityX: 0,
            velocityY: 0,
            startTime: 0,
            lastTime: 0,
            justReleased: false
        };
    }

    /**
     * Begins tracking a new pointer gesture.
     * @param {Number} x The x position of the gesture start.
     * @param {Number} y The y position of the gesture start.
     * @param {Number} now The current timestamp.
     */
    beginGesture(x, y, now) {
        this.gestureState.isActive = true;
        this.gestureState.isDragging = false;
        this.gestureState.startPosition.set(x, y);
        this.gestureState.currentPosition.set(x, y);
        this.gestureState.lastPosition.set(x, y);
        this.gestureState.distanceX = 0;
        this.gestureState.distanceY = 0;
        this.gestureState.velocityX = 0;
        this.gestureState.velocityY = 0;
        this.gestureState.startTime = now;
        this.gestureState.lastTime = now;
        this.gestureState.justReleased = false;
    }

    /**
     * Updates the gesture as the pointer moves.
     * @param {Number} x The current x position.
     * @param {Number} y The current y position.
     * @param {Number} now The current timestamp.
     */
    updateGesture(x, y, now) {
        if (!this.gestureState.isActive) return;

        const deltaX = x - this.gestureState.currentPosition.x;
        const deltaY = y - this.gestureState.currentPosition.y;
        const elapsed = Math.max(1, now - this.gestureState.lastTime);
        const rawVelocityX = deltaX / elapsed * 1000;
        const rawVelocityY = deltaY / elapsed * 1000;

        this.gestureState.currentPosition.set(x, y);
        this.gestureState.lastPosition.set(x, y);
        this.gestureState.lastTime = now;
        this.gestureState.distanceX = this.gestureState.currentPosition.x - this.gestureState.startPosition.x;
        this.gestureState.distanceY = this.gestureState.currentPosition.y - this.gestureState.startPosition.y;
        this.gestureState.velocityX = this.gestureState.velocityX * SMOOTHING_ALPHA + rawVelocityX * RAW_VELOCITY_WEIGHT;
        this.gestureState.velocityY = this.gestureState.velocityY * SMOOTHING_ALPHA + rawVelocityY * RAW_VELOCITY_WEIGHT;
        this.gestureState.isDragging = true;
    }

    /**
     * Finalizes a gesture after the pointer is released.
     * @param {Number} x The x position at release.
     * @param {Number} y The y position at release.
     */
    finishGesture(x, y) {
        this.gestureState.currentPosition.set(x, y);
        this.gestureState.distanceX = this.gestureState.currentPosition.x - this.gestureState.startPosition.x;
        this.gestureState.distanceY = this.gestureState.currentPosition.y - this.gestureState.startPosition.y;
        this.gestureState.isActive = false;
        this.gestureState.justReleased = true;
    }

    /**
     * Decays the current gesture velocity over time while the pointer is idle.
     * @param {Number} dt The elapsed time in seconds.
     */
    decayGestureVelocity(dt) {
        const decayFactor = Math.exp(-VELOCITY_DECAY_RATE * Math.max(0, dt || 0));
        this.gestureState.velocityX *= decayFactor;
        this.gestureState.velocityY *= decayFactor;

        if (Math.abs(this.gestureState.velocityX) < VELOCITY_EPSILON) {
            this.gestureState.velocityX = 0;
        }

        if (Math.abs(this.gestureState.velocityY) < VELOCITY_EPSILON) {
            this.gestureState.velocityY = 0;
        }
    }
    
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

    /**
     * Determines whether the current pointer is within the bounds of the canvas.
     * @param {Event} event The pointer event.
     * @returns True if the pointer is within the canvas bounds.
     */
    pointerIsInsideCanvas(event) {
        const rect = renderer.canvas.getBoundingClientRect();

        return (
            event.clientX >= rect.left &&
            event.clientX < rect.right &&
            event.clientY >= rect.top &&
            event.clientY < rect.bottom
        );
    }
}