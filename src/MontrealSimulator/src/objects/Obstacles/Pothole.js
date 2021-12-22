import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { images, DEBUG, context, sounds, settings, canvas, timer } from "../../globals.js";
import Obstacle from "./Obstacle.js";
import Hitbox from "../../../lib/Hitbox.js";
import SoundName from "../../enums/SoundName.js";
import EventName from "../../enums/EventName.js";

export default class Pothole extends Obstacle
{
    static WIDTH = 650;
    static HEIGHT = 613;

    static SCALE = 1 / 8;

    static HITBOX_OFFSET = 20;
    static DESPAWN_POINT = -500;

    constructor(position)
    {
        super(position, { x: Pothole.WIDTH * Pothole.SCALE, y: Pothole.HEIGHT * Pothole.SCALE });
        this.sprite = new Sprite(images.get(ImageName.Pothole), 0, 0, Pothole.WIDTH, Pothole.HEIGHT);
        this.hitbox = new Hitbox(
            this.position.x + Pothole.HITBOX_OFFSET, 
            this.position.y + Pothole.HITBOX_OFFSET, 
            this.dimensions.x - (Pothole.HITBOX_OFFSET * 2), 
            this.dimensions.y - (Pothole.HITBOX_OFFSET * 2));
    }

    update(dt)
    {
        this.hitbox.position.x = this.position.x + Pothole.HITBOX_OFFSET;
        this.hitbox.position.y = this.position.y + Pothole.HITBOX_OFFSET;

        if (this.position.x < Pothole.DESPAWN_POINT) this.shouldCleanUp = true;
    }

    render()
    {
        super.render(Pothole.SCALE);

        if (DEBUG)
        {
            this.hitbox.render(context);
        }
    }

    collisionAction(collider, level)
    {
        if (!this.isColliding) 
        {
            this.isColliding = true;
            this.damagePlayer(collider, level);
        }
    }

    damagePlayer(player, level)
    {
        const TWEEN_DISTANCE = 10;

        const MIN_VELOCITY = 100;
        const SPEED_NERF = 250;

        if (!level.complete) player.currentHealth--;
        
        if (!settings.muteSound) sounds.play(SoundName.Hit);

        if (player.currentHealth === 0)
        {
            if (!settings.muteSound) sounds.play(SoundName.Boom);

            let distanceInMeters = level.getDistanceM(level.distance);
            settings.totalDistance = settings.totalDistance + distanceInMeters;

            canvas.dispatchEvent(new CustomEvent(EventName.GameOver));
        } 
        else 
        {
            timer.tween(player.position, ['x'], [player.position.x - TWEEN_DISTANCE], 0.05, () =>
            {
                timer.tween(player.position, ['x'], [player.position.x + TWEEN_DISTANCE], 0.05);
            });

            player.velocity.x = Math.max(MIN_VELOCITY, player.velocity.x - SPEED_NERF);
        }
    }
}