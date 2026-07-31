import CanvasObject from "./CanvasObject.js";
import { renderer, input, sound, SOUNDS } from "../globals.js";
import InputHandler from "./Input/InputHandler.js";
import Vector from "./Vector.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./RenderSytem.js";
import MenuOption from "./MenuOption.js";
import { InputTypes } from "./Input/InputManager.js";

/** Generic base class for menus which handles rendering and input handling. */
export default class Menu extends CanvasObject {
    /**
     * @param {Vector} position Offset x/y coordinates to position the menu on the canvas.
     * @param {Vector} dimensions The size of the menu to be displayed in the canvas.
     */
    constructor(position, dimensions = new Vector(CANVAS_HEIGHT, CANVAS_WIDTH)) {
        super(position, dimensions);
        this.menuOptions = [];
        this.cursorPosition = null;
        this.cancelOption = null;
    }

    /**
     * Handles menu-specific input.
     * @param {Number} dt Delta Time, or the time passed since the last frame.
     */
    update(dt) {
        // Handles tap/mouse input.
        this.updateCursorFromPointer();

        let index = this.cursorPosition;
        let states = Object.entries(input.get());
        let length = this.menuOptions.length;

        // Handles key input.
        states.forEach(state => {
            if (state[1] !== InputHandler.ACTIONSTATE.Down) return;

            switch (state[0]) {
                case InputHandler.ACTIONS.Up:
                    index = (index === null) ? 0 : (index - 1 + length) % length;
                    this.updateCursor(index);
                    sound.play(SOUNDS.Blip);
                    break;

                case InputHandler.ACTIONS.Down:
                    index = (index === null) ? length - 1 : (index + 1 + length) % length;
                    this.updateCursor(index);
                    sound.play(SOUNDS.Blip);
                    break;

                case InputHandler.ACTIONS.A:
                    this.menuOptions[this.cursorPosition]?.task();
                    if (this.cursorPosition !== null) sound.play(SOUNDS.Select);
                    break;

                case InputHandler.ACTIONS.B:
                    sound.play(SOUNDS.Cancel);
                    this.menuOptions[this.cancelOption]?.task();
                    break;
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
        if (this.cursorPosition !== null) this.menuOptions[this.cursorPosition].isSelected = false;
        this.cursorPosition = index;
        this.menuOptions[index].isSelected = true;
    }

    /** Updates the menu cursor position and sets isSelected based on pointer position.  */
    updateCursorFromPointer() {
        const rawPointer = input.getPointerPosition(); // Gets client coordinates based on current input (tap or mouse)
        const pointer = renderer.getPointerPosition(rawPointer); // Gets actual canvas coordinates
        const currentInput = input.currentInput;

        if (!pointer) return; // Only update menu cursor position here if pointer is the current input.

        // Get the index of the option currently hovered over (if applicable)
        let hoveredIndex = null;
        this.menuOptions.forEach((option, index) => {
            if (this.isPointerOverOption(option, pointer)) hoveredIndex = index;
        });

        // Set all option's isSelected based on those findings.
        this.menuOptions.forEach((option, index) => {
            option.isSelected = index === hoveredIndex;
        });

        // Set the cursor menu's cursor position and play the menu sound if it changed.
        if (hoveredIndex !== null && this.cursorPosition !== hoveredIndex) {
            this.cursorPosition = hoveredIndex;
            // The blip should only be played on mouse hover, not on tap.
            if (currentInput === InputTypes.Mouse) sound.play(SOUNDS.Blip);
        } else if (hoveredIndex === null && this.cursorPosition !== hoveredIndex) {
            // If nothing is hovered over, there is no cursor to display.
            this.cursorPosition = null;
        }
    }

    /**
     * Determines whether an input pointer is within the hitbox bounds of a menu option.
     * @param {MenuOption} option The menu option to determine whether the pointer is hovering over.
     * @param {Vector} pointer The x and y coordinates of the current pointer input type.
     * @returns {Boolean} True if the current input pointer is hovered over the menu option in canvas.
     */
    isPointerOverOption(option, pointer) {
        const bounds = option.getBounds(this.position.x, this.position.y);

        const width = bounds.size.x;
        const height = bounds.size.y; 

        const x = bounds.pos.x;
        const y = bounds.pos.y;

        return (
            pointer.x >= x &&
            pointer.x <= x + width &&
            pointer.y >= y &&
            pointer.y <= y + height
        );
    }
}