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

    /** Handles menu-specific input. */
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
                        this.cursorPosition = index;
                        break;
                    case InputHandler.ACTIONS.Down:
                        index = (index + 1 + length) % length;
                        this.cursorPosition = index;
                        break;
                }
            }
        }); 
    }

    /** Renders the menu options and cursor. */
    render() {
        this.renderBackground();
        this.renderText();
        this.renderCursor();
    }

    /** Renders the menu option text. */ 
    renderText() {
        let xOffset = this.position.x;
        let yOffset = this.position.y;

        // Render each menu option.
        this.menuOptions.forEach(option => {
            renderer.menuOption(option, xOffset, yOffset);
        });
    }

    /** Renders a cursor line under the currently selected option. */
    renderCursor() {
        let xOffset = this.position.x;
        let yOffset = this.position.y;
        let currentChoice = this.menuOptions[this.cursorPosition];
        let x = currentChoice.position.x + xOffset;
        let y = currentChoice.position.y + yOffset;
        let width = renderer.ctx.measureText(currentChoice.id).width;
        renderer.line(x - (width / 2), y + 10, width);
    }

    /** Renders the box containing the menu options. */
    renderBackground() {
        renderer.box(this.position, this.dimensions);
    }
}