import { CANVAS_HEIGHT, keys, DEBUG, context, settings, sounds } from "../globals.js";
import Car from "./Car.js";
import Animation from "../../lib/Animation.js";
import SoundName from "../enums/SoundName.js";

export default class Player extends Car
{
    static SPAWN_POS_X = 25;
    static SPAWN_POS_Y = CANVAS_HEIGHT / 2 + 90 ;
    static BASELINE_SPEED = 750; // Represents 75 KMH and speed of AI
    static SPEED_MULTIPLIER = 500; // Represents 50 KMH which is added for each stat bar

    static TURN_VELOCITY = 250;

    static ROAD_TOP = 335;
    static ROAD_BOTTOM = 585;

    static MIN_FLIP = 2; // Oil slick animation sprite flip start 
    static MAX_FLIP = 5; // Oil slick animation sprite flip end

    constructor(carType)
    {
        super({ x: Player.SPAWN_POS_X, y: Player.SPAWN_POS_Y}, carType);
        this.drivingAnimation = new Animation([2], 0);
        this.oilSlickAnimation = new Animation([3, 4, 3, 2, 1, 0, 1, 2], 0.1, 5);
        this.animation = this.drivingAnimation;

        this.isBraking = false;
        this.isAccelerating = false;
        this.isSlipping = false;
        this.isHonking = false;
        this.currentHealth = this.stats.health;
    }

    update(dt)
    {
        super.update(dt);

        this.position.y += this.velocity.y * dt;

        this.position.y = Math.max(Player.ROAD_TOP, this.position.y);
        this.position.y = Math.min(Player.ROAD_BOTTOM, this.position.y);

        this.handleInput();

        if (this.animation.cycles > 0 && this.animation.isDone())
        {
            this.isSlipping = false;
            this.oilSlickAnimation.refresh();
            this.animation = this.drivingAnimation;
        } 
    }

    render()
    {
        this.renderShadow();

        if (this.animation.currentFrame < Player.MIN_FLIP || this.animation.currentFrame > Player.MAX_FLIP)
        {
            this.sprites[this.animation.getCurrentFrame()].render(this.position.x, this.position.y);
        } 
        else 
        {
            context.save();
			context.translate(Math.floor(this.position.x) + Car.WIDTH, Math.floor(this.position.y));
			context.scale(-1, 1);
			this.sprites[this.animation.getCurrentFrame()].render(0, 0);
			context.restore();
        }

        if (DEBUG)
        {
            this.hitbox.render(context);
        }
    }

    handleInput()
    {
        this.handleHorn();

        if (!this.isSlipping)
        {
            this.handleSteering();
            this.handleSpeed();
        }
        else
        {
            if (this.velocity.y < 0) this.velocity.y += 10;
            else if (this.velocity.y > 0) this.velocity.y -= 10;
            else this.velocity.y = 0;
        }
    }

    handleHorn()
    {
        if (keys[' '])
        {
            if (!this.isHonking)
            {
                this.isHonking = true;
                if (!settings.muteSound) sounds.play(SoundName.Honk);
            }
        }
        else 
        {
            this.isHonking = false;
            if (!settings.muteSound) sounds.stop(SoundName.Honk);
        }
    }

    handleSteering()
    {
        let speed = this.getSpeedKMH();
        let percentage = Math.min(1, speed / 100);

        if (speed > 0)
        {
            if (keys.ArrowUp)
            {
                if (!keys.ArrowDown) this.velocity.y = -(Player.TURN_VELOCITY * percentage);
            }
            
            if (keys.ArrowDown)
            {
                if (!keys.ArrowUp) this.velocity.y = Player.TURN_VELOCITY * percentage;
            }
            
            if (!keys.ArrowUp && !keys.ArrowDown)
            {
                if (this.velocity.y < 0) this.velocity.y += 10;
                else if (this.velocity.y > 0) this.velocity.y -= 10;
                else this.velocity.y = 0;
            }
        }
        else this.velocity.y = 0;
    }

    handleSpeed()
    {
        if (keys.ArrowRight)
        {
            if (!this.isBraking)
            {
                this.isAccelerating = true;

                let topSpeed = Player.BASELINE_SPEED + (this.stats.topSpeed * Player.SPEED_MULTIPLIER);
                let nextSpeedIncremement = this.stats.acceleration * Car.ACCELERATION_MULTIPLIER;
    
                this.velocity.x = Math.min(topSpeed, this.velocity.x + nextSpeedIncremement);
            }
        }
        else this.isAccelerating = false;
        
        if (keys.ArrowLeft)
        {
            if (!this.isAccelerating)
            {
                this.isBraking = true;
                // No reversing allowed but braking is a thing
                this.velocity.x = Math.max(0, this.velocity.x - Car.BRAKE_MULTIPLIER);
            }
        }
        else this.isBraking = false;
        
        if (!this.isAccelerating || !this.isBraking)
        {
            // Car slowly decelerates with no input
            this.velocity.x = Math.max(0, this.velocity.x - 1);
        }
    }
}