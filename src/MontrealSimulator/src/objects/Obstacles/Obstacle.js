import CanvasObject from "../CanvasObject.js";
import Hitbox from "../../../lib/Hitbox.js";

// Abstract class from which all obstacles should inherit.
export default class Obstacle extends CanvasObject
{
    constructor(position, dimensions)
    {
        super(position, dimensions);
        this.sprite;
        this.hitbox = new Hitbox();
        this.shouldCleanUp = false;
        this.isColliding = false;
    }

    render(scale = 1)
    {
        this.sprite.render(this.position.x, this.position.y, { x: scale, y: scale });
    }

    collisionAction(collider)
    {

    }
}