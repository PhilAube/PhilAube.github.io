import Sprite from "../../lib/Sprite.js";
import CanvasObject from "./CanvasObject.js";
import ImageName from "../enums/ImageName.js";
import { CANVAS_WIDTH, images } from "../globals.js";

export default class Lock extends CanvasObject
{
    static SCALE = 3/5;
    static WIDTH = 256;
    static HEIGHT = 256;
    static POS_X = CANVAS_WIDTH / 2 - ((Lock.WIDTH / 2) * Lock.SCALE);
    static POS_Y = 150;

    constructor()
    {
        super({ x: Lock.POS_X, y: Lock.POS_Y }, { x: Lock.WIDTH, y: Lock.HEIGHT });
        this.sprite = new Sprite(images.get(ImageName.Lock), 0, 0, Lock.WIDTH, Lock.HEIGHT);
    }
    
    render()
    {
        this.sprite.render(this.position.x, this.position.y, { x: Lock.SCALE, y: Lock.SCALE });
    }
}