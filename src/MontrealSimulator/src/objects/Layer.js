import CanvasObject from "./CanvasObject.js";

export default class Layer extends CanvasObject
{
    constructor(image, repeats = 1)
    {
        super({ x: 0, y: 0 }, { x: image.width, y: image.height });
        this.image = image;

        this.repeats = repeats;
    }

    update(dt)
    {

    }

    render()
    {
        for (let i = 0; i < this.repeats; i++)
        {
            const x = -this.position.x + (this.dimensions.x * i)
            this.image.render(x, this.position.y);
        }
    }
}