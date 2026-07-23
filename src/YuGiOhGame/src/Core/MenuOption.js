import CanvasObject from "./CanvasObject.js";
import { renderer } from "../globals.js";
import Vector from "./Vector.js";
import { CANVAS_WIDTH } from "./RenderSytem.js";
import { THEMES } from "../themes.js";

/** Represents a selectable option in a Menu system. */
export default class MenuOption extends CanvasObject {

    /**
     * @param {String} name The enum value of the menu option name.
     * @param {Function} task The task to be executed when selecting this option.
     * @param {Vector} position The offset where the option is displayed relative to the Menu's CanvasObject.
     */
    constructor(id, task, position, isSelected = false) {
        super(position);
        this.id = id;
        this.task = task;
        this.dimensions = this.setDimensions();
        this.isSelected = isSelected;
    }

    /**
     * Displays the current menu option.
     * @param {Number} xOffset The X offset of the parent Menu containing this option.
     * @param {Number} yOffset The Y offset of the parent Menu containing this option.
     */
    render(xOffset = 0, yOffset = 0) {
        const PADDING = 15;

        let boxX = this.position.x - (this.dimensions.x / 2) - (PADDING / 2);
        let boxY = this.position.y - this.dimensions.y - (PADDING / 2)
        let boxPos = new Vector(boxX, boxY);
        let boxSize = new Vector(this.dimensions.x + PADDING, this.dimensions.y + PADDING);
        renderer.roundedBox(this.isSelected ? "black" : "gray", boxPos, boxSize, this.isSelected);

        let textX = this.position.x + xOffset;
        let textY = this.position.y + yOffset;
        renderer.text(this.id, textX, textY)
    }

    /** Initializes the dimensions of the menu option based on the text. */
    setDimensions() {
        const measure = renderer.measureText(this.id, THEMES.FontSizes.Medium);
        return new Vector(measure.width, measure.height);
    }

    updateText(newText) {
        this.id = newText;
        this.dimensions = this.setDimensions();
    }
}