import CanvasObject from "./CanvasObject.js";
import { renderer, input } from "../globals.js";
import InputHandler from "./Input/InputHandler.js";
import Vector from "./Vector.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./RenderSytem.js";

/** Generic base class for menus which handles rendering and input handling. */
export default class Menu extends CanvasObject {
    /**
     * @param {Vector} position Offset x/y coordinates to position the menu on the canvas.
     * @param {Vector} dimensions The size of the menu to be displayed in the canvas.
     */
    constructor(position, dimensions = new Vector(CANVAS_HEIGHT, CANVAS_WIDTH)) {
        super(position, dimensions);
        this.menuOptions = [];
        this.cursorPosition = 0;
    }

    /**
     * Handles menu-specific input.
     * @param {Number} dt Delta Time, or the time passed since the last frame.
     */
    update(dt) {
        let index = this.cursorPosition;
        let states = Object.entries(input.get());
        let length = this.menuOptions.length;

        states.forEach(state => {
            // Only handle menu input on one frame to avoid repeated cursor moves.
            if (state[1] === InputHandler.ACTIONSTATE.Down) {
                switch (state[0]) {
                    case InputHandler.ACTIONS.Up:
                        index = (index - 1 + length) % length;
                        this.updateCursor(index);
                        break;
                    case InputHandler.ACTIONS.Down:
                        index = (index + 1 + length) % length;
                        this.updateCursor(index);
                        break;
                    case InputHandler.ACTIONS.A:
                        this.menuOptions[this.cursorPosition].task();
                        break;
                }
            }
        }); 
    }

    /** Renders the menu options and cursor. */
    render() {
        this.renderBackground();
        this.renderMenuOptions();
    }

    /** Renders the menu option text. */ 
    renderMenuOptions() {
        let xOffset = this.position.x;
        let yOffset = this.position.y;

        // Render each menu option.
        this.menuOptions.forEach(option => {
            option.render(xOffset, yOffset);
        });
    }

    /** Renders the box containing the menu options. */
    renderBackground() {
        renderer.box(this.position, this.dimensions);
    }

    /**
     * Updates the menu cursor position and sets isSelected on menu options.
     * @param {Number} index The new menu cursor position to be set.
     */
    updateCursor(index) {
        this.menuOptions[this.cursorPosition].isSelected = false;
        this.cursorPosition = index;
        this.menuOptions[index].isSelected = true;
    }
}