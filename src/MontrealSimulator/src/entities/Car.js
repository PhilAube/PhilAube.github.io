import GameEntity from "./GameEntity.js";
import Sprite from "../../lib/Sprite.js";
import { images, context, DEBUG } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import Animation from "../../lib/Animation.js";
import CarType from "../enums/CarType.js";
import Hitbox from "../../lib/Hitbox.js";

export default class Car extends GameEntity
{
    static HEIGHT = 150; // HEIGHT / ROWS (3600 / 24)
    static WIDTH = 200; // WIDTH / COLUMNS (1000 / 5)
    static FLIP_THRESHOLD = 5; // When the image needs to be flipped

    static ACCELERATION_MULTIPLIER = 3; // How fast do cars accelerate?
    static BRAKE_MULTIPLIER = 6; // How fast do cars brake?

    static HITBOX_OFFSET_Y = 60;
    static HITBOX_OFFSET_X = 20;
    static HITBOX_HEIGHT = 45;

    constructor(position, carType) 
    {
        super(position);
        this.type = carType;
        this.sprites = this.generateCarSprites(carType);
        this.titleScreenAnimation = new Animation([0, 1, 2, 3, 4, 3, 2, 1], 0.25, 0);
        this.animation = this.titleScreenAnimation;
        this.stats = this.setStats(carType);
        this.hitbox = new Hitbox(
            this.position.x + Car.HITBOX_OFFSET_X, 
            this.position.y + Car.HITBOX_OFFSET_Y, 
            Car.WIDTH - (Car.HITBOX_OFFSET_X * 2), 
            Car.HITBOX_HEIGHT);

        this.isLocked = true;
    }

    update(dt)
    {
        this.animation.update(dt);

        this.hitbox.position.x = this.position.x + Car.HITBOX_OFFSET_X;
        this.hitbox.position.y = this.position.y + Car.HITBOX_OFFSET_Y;
    }

    render()
    {
        this.renderShadow();

        if (this.animation.currentFrame < Car.FLIP_THRESHOLD)
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

    generateCarSprites(carType)
    {
        return Sprite.generateSubsetFromSpriteSheet(images.get(ImageName.Cars), Car.WIDTH, Car.HEIGHT, carType);
    }

    setStats(carType)
    {
        let stats = {};

        for (let type in CarType)
        {
            let num = CarType[type];

            if (num === carType)
            {
                if (type.includes("Sedan"))
                {
                    stats.topSpeed = 1;
                    stats.acceleration = 1;
                    stats.health = 1;
                }
                else if (type.includes("Sports"))
                {
                    stats.topSpeed = 2;
                    stats.acceleration = 2;
                    stats.health = 2;
                }
                else if (type.includes("Super"))
                {
                    stats.topSpeed = 3;
                    stats.acceleration = 3;
                    stats.health = 1;
                }
                else if (type.includes("Pickup"))
                {
                    stats.topSpeed = 1;
                    stats.acceleration = 1;
                    stats.health = 3;
                }

                return stats;
            }
        }
    }

    renderShadow()
    {
        context.save();

        context.fillStyle = '#555';
        context.globalAlpha = 0.25;

        context.beginPath();
        context.ellipse(this.position.x + Car.WIDTH / 2 - 1, this.position.y + 95, 115, 30, 0, 0, 2 * Math.PI);
        context.fill();

        context.restore();
    }

    getSpeedKMH()
    {
        const MAGIC_NUMBER = 10;

        return Math.ceil(this.velocity.x / MAGIC_NUMBER);
    }
}