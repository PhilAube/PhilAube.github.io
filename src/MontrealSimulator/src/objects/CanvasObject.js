// This class represents a base class for non-entities to be drawn on the canvas.
export default class CanvasObject
{
    constructor(position, dimensions)
    {
        this.position = position;
        this.dimensions = dimensions;
    }

    update(dt) { }

    render() { }
}