import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { images, DEBUG, context, sounds, settings, timer, canvas } from "../../globals.js";
import Obstacle from "./Obstacle.js";
import Hitbox from "../../../lib/Hitbox.js";
import SoundName from "../../enums/SoundName.js";
import EventName from "../../enums/EventName.js";

export default class Cone extends Obstacle
{
    static WIDTH = 801;
    static HEIGHT = 929;

    static SCALE = 1 / 20;

    static HITBOX_OFFSET = 20;

    static HITBOX_WIDTH = Cone.WIDTH * Cone.SCALE;
    static HITBOX_HEIGHT = Cone.HEIGHT * Cone.SCALE;

    static DESPAWN_POINT = -500;

    constructor(position)
    {
        super(position, { x: Cone.WIDTH * Cone.SCALE, y: Cone.HEIGHT * Cone.SCALE});
        this.sprite = new Sprite(images.get(ImageName.Cone), 0, 0, Cone.WIDTH, Cone.HEIGHT);
        this.hitbox = new Hitbox(
            this.position.x - Cone.HITBOX_OFFSET,
            this.position.y - Cone.HITBOX_OFFSET, 
            Cone.HITBOX_WIDTH,
            Cone.HITBOX_HEIGHT);

        this.wasHit = false;
        this.rotation = 0;
    }

    update(dt)
    {
        this.hitbox.position.x = this.position.x - Cone.HITBOX_OFFSET;
        this.hitbox.position.y = this.position.y - Cone.HITBOX_OFFSET;

        if (this.position.x < Cone.DESPAWN_POINT) this.shouldCleanUp = true;
    }

    render()
    {
        if (!this.wasHit) this.renderShadow();
        
        context.save();
        
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation);

        let x = -(Cone.WIDTH * Cone.SCALE) / 2;
        let y = -(Cone.HEIGHT * Cone.SCALE) / 2;

        this.sprite.render(x, y, { x: Cone.SCALE, y: Cone.SCALE });

        context.restore();

        if (DEBUG)
        {
            this.hitbox.render(context);
        }
    }

    collisionAction(collider, level)
    {
        if (!this.isColliding && !this.wasHit) 
        {
            this.isColliding = true;
            this.wasHit = true;
            this.damagePlayer(collider, level);
            this.fly(collider);
        }
    }

    // Sends the cone flying depending on player speed
    fly(player)
    {
        let dist = player.getSpeedKMH();

        timer.tween(this, ['rotation'], [(Math.PI / 2) * 3], 0.2);

        if (dist >= 100 && player.currentHealth > 0)
        {
            timer.tween(this.position, ['x'], [this.position.x + 50], 0.05, () =>
            {
                timer.tween(this.position, ['x'], [-50], 0.15);
            });
            timer.tween(this.position, ['y'], [this.position.y - (dist * 2)], 0.2);
        }
        else 
        {
            timer.tween(this.position, ['x'], [this.position.x + 25], 0.2);
            timer.tween(this.position, ['y'], [this.position.y + dist], 0.2);
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

    renderShadow()
    {
        context.save();

        context.fillStyle = '#555';
        context.globalAlpha = 0.25;

        context.beginPath();
        context.ellipse(this.position.x  + ((Cone.WIDTH * Cone.SCALE) / 2) - 20, this.position.y + 25, 30, 10, 0, 0, 2 * Math.PI);
        context.fill();

        context.restore();
    }
}