import Vector from "./Vector.js";

/** Represents a base class for objects to be drawn on the canvas. */
export default class CanvasObject
{
    /**
     * @param {Vector} position X/Y offset to draw.
     * @param {Vector} dimensions X/Y size.
     */
    constructor(position = new Vector(), dimensions = new Vector())
    {
        this.position = position;
        this.dimensions = dimensions;
    }

    update(dt) { }

    render() { }
}