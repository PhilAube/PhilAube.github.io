import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { images, DEBUG, context, sounds, settings } from "../../globals.js";
import Obstacle from "./Obstacle.js";
import Hitbox from "../../../lib/Hitbox.js";
import SoundName from "../../enums/SoundName.js";

export default class Poutine extends Obstacle
{
    static WIDTH = 696;
    static HEIGHT = 565;

    static SCALE = 1 / 8;

    static OFFSET_X = 10
    static OFFSET_Y = 10
    static HITBOX_WIDTH = 50;
    static HITBOX_HEIGHT = 55;

    static DESPAWN_POINT = -500;

    constructor(position)
    {
        super(position, { x: Poutine.WIDTH * Poutine.SCALE, y: Poutine.HEIGHT * Poutine.SCALE});
        this.sprite = new Sprite(images.get(ImageName.Poutine), 0, 0, Poutine.WIDTH, Poutine.HEIGHT);
        this.hitbox = new Hitbox(
            this.position.x + Poutine.OFFSET_X, 
            this.position.y + Poutine.OFFSET_Y, 
            Poutine.HITBOX_WIDTH,
            Poutine.HITBOX_HEIGHT);
    }

    update(dt)
    {
        this.hitbox.position.x = this.position.x + Poutine.OFFSET_X;
        this.hitbox.position.y = this.position.y + Poutine.OFFSET_Y;

        if (this.position.x < Poutine.DESPAWN_POINT) this.shouldCleanUp = true;
    }

    render()
    {
        this.renderShadow();

        super.render(Poutine.SCALE);

        if (DEBUG)
        {
            this.hitbox.render(context);
        }
    }

    collisionAction(collider)
    {
        if (!this.isColliding) 
        {
            this.isColliding = true;
            this.healPlayer(collider);
        }
    }

    healPlayer(player)
    {
        if (player.currentHealth < 3) player.currentHealth++;

        this.shouldCleanUp = true;
            
        if (!settings.muteSound) sounds.play(SoundName.Poutine);
    }

    renderShadow()
    {
        const OFFSET = 8;

        context.save();

        context.fillStyle = '#555';
        context.globalAlpha = 0.25;

        context.beginPath();
        context.ellipse(this.position.x  + ((Poutine.WIDTH * Poutine.SCALE) / 2) - OFFSET, this.position.y + 70, 30, 10, 0, 0, 2 * Math.PI);
        context.fill();

        context.restore();
    }
}