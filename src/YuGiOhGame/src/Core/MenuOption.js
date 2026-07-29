import CanvasObject from "./CanvasObject.js";
import { renderer } from "../globals.js";
import Vector from "./Vector.js";
import { CANVAS_WIDTH } from "./RenderSytem.js";
import { THEMES } from "../themes.js";

const PADDING = 15;

/** Represents a selectable option in a Menu system. */
export default class MenuOption extends CanvasObject {
    /**
     * @param {String} name The enum value of the menu option name.
     * @param {Function} task The task to be executed when selecting this option.
     * @param {Vector} position The offset where the option is displayed relative to the Menu's CanvasObject.
     * @param {Vector} dimensions The explicit dimensions for the clickable/tappable area, optionally.
     */
    constructor(id, task, position = null, dimensions = null) {
        super(position);
        this.id = id;
        this.task = task;
        this.dimensions = null;
        this.setDimensions(dimensions);
        this.isSelected = false;
    }

    /**
     * Displays the current menu option.
     * @param {Number} xOffset The X offset of the parent Menu containing this option.
     * @param {Number} yOffset The Y offset of the parent Menu containing this option.
     */
    render(xOffset = 0, yOffset = 0) {
        if (this.id.trim().length === 0) return; // Silently skip buttons with no text.

        const bounds = this.getBounds(xOffset, yOffset);
        renderer.roundedBox(this.isSelected ? "black" : "gray", bounds.pos, bounds.size, this.isSelected);

        let textX = this.position.x + xOffset;
        let textY = this.position.y + yOffset;
        renderer.text(this.id, textX, textY)
    }


    /**
     * Initializes the dimensions of the menu option based on the text or explicitly.
     * @param {Vector} dimensions The explicit dimensions of the menu option.
     */
    setDimensions(dimensions) {
        if (dimensions) {
            // Allows us to override the dimensions by passing into constructor.
            this.dimensions = dimensions;
        } else {
            // Otherwise, the dimensions are set automatically based on text contents.
            const measure = renderer.measureText(this.id, THEMES.FontSizes.Medium);
            this.dimensions = new Vector(measure.width, measure.height);
        }
    }

    /**
     * Updates a menu option's text and size to fit new text.
     * @param {String} newText The updated text to set for the menu option to display.
     */
    updateText(newText) {
        this.id = newText;
        this.setDimensions();
    }

    /**
     * Gets the input pointer bounds for the current menu option.
     * @param {Number} xOffset The x-coordinate position offset of the parent Menu.
     * @param {Number} yOffset The y-coordinate position offset of the parent Menu.
     * @returns {Object} An object containing two Vectors representing position and size.
     */
    getBounds(xOffset = 0, yOffset = 0) {
        // Override the bounds to use explicit dimensions when ID is empty string.
        if (this.id.trim().length === 0) {
            return {
                pos: new Vector(
                    this.position.x + xOffset - (this.dimensions.x / 2),
                    this.position.y + yOffset - (this.dimensions.y / 2)),
                size: new Vector(this.dimensions.x, this.dimensions.y)
            };
        }

        // Otherwise, calculate based on padding and text bounds.
        return {
            pos: new Vector(
                this.position.x + xOffset - this.dimensions.x / 2 - PADDING / 2,
                this.position.y + yOffset - this.dimensions.y - PADDING / 2),
            size: new Vector(this.dimensions.x + PADDING, this.dimensions.y + PADDING)
        };
    }
}