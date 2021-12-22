import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { images, DEBUG, context } from "../../globals.js";
import Obstacle from "./Obstacle.js";
import Hitbox from "../../../lib/Hitbox.js";

export default class OilSlick extends Obstacle
{
    static WIDTH = 200;
    static HEIGHT = 200;

    static HITBOX_OFFSET = 95;
    static HITBOX_HEIGHT = 30;
    static DESPAWN_POINT = -500;

    constructor(position)
    {
        super(position, { x: OilSlick.WIDTH, y: OilSlick.HEIGHT});
        this.sprite = new Sprite(images.get(ImageName.OilSlick), 0, 0, OilSlick.WIDTH, OilSlick.HEIGHT);
        this.hitbox = new Hitbox(this.position.x, this.position.y + OilSlick.HITBOX_OFFSET, this.dimensions.x, OilSlick.HITBOX_HEIGHT);
    }

    update(dt)
    {
        this.hitbox.position.x = this.position.x;
        this.hitbox.position.y = this.position.y + OilSlick.HITBOX_OFFSET;

        if (this.position.x < OilSlick.DESPAWN_POINT) this.shouldCleanUp = true;
    }

    render()
    {
        super.render();

        if (DEBUG)
        {
            this.hitbox.render(context);
        }
    }

    collisionAction(collider)
    {
        if (!this.isColliding) 
        {
            if (!collider.isSlipping)
            {
                this.isColliding = true;
                this.spinPlayer(collider);
            }
        }
    }

    spinPlayer(player)
    {
        player.animation = player.oilSlickAnimation;
        player.oilSlickAnimation.refresh();
        player.isSlipping = true;
    }
}