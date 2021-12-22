import Sprite from "../../lib/Sprite.js";
import CanvasObject from "./CanvasObject.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Animation from "../../lib/Animation.js";

export default class Fire extends CanvasObject
{
    static WIDTH = 730;
    static HEIGHT = 150;

    constructor(position)
    {
        super({ x: position.x, y: position.y - 90 }, { x: Fire.WIDTH, y: Fire.HEIGHT });
        this.sprites = Sprite.generateSpritesFromSpriteSheet(images.get(ImageName.Fire), Fire.WIDTH / 4, Fire.HEIGHT);
        this.animation = new Animation([1, 2, 3], 0.2);
    }

    update(dt)
    {
        this.animation.update(dt);
    }
    
    render()
    {
        this.sprites[this.animation.getCurrentFrame()].render(this.position.x, this.position.y);
    }
}