import ImageName from "../enums/ImageName.js";
import { canvas, images, settings, sounds, stateMachine, timer } from "../globals.js";
import Ground from "./Ground.js";
import Layer from "./Layer.js";
import ObstacleFactory from "../services/ObstacleFactory.js";
import EventName from "../enums/EventName.js";
import GameStateName from "../enums/GameStateName.js";
import { oneInXChance } from "../../lib/RandomNumberHelpers.js";
import SoundName from "../enums/SoundName.js";
import MessageBox from "./MessageBox.js";
import OilSlick from "./Obstacles/OilSlick.js";

export default class Level
{
    static MAX_SPAWNRATE = 25; // Closest distance between two obstacles (in meters)

    static TARGET_MULTIPLIER = 1000; // To win each level, the distance must hit LevelNumber * ThisNumber
    static MIDDLEGROUND_OFFSET = { x: 0, y: 55 };

    static FG_LOOP_POINT = 500;
    static MG_LOOP_POINT = 593;

    static TIME_SCALE = 0.75; // How fast is the game in general?

    static MG_RATIO = 0.1; // How fast / slow the middle ground scrolls

    static SCORE_UPDATE_RATE = 10; // How often the score is incremented (in meters)

    constructor(player, level)
    {
        this.player = player;
        this.level = level;
        this.foreground = new Ground();
        this.middleground = new Layer(images.get(ImageName.Skyline), 3);
        this.middleground.position = Level.MIDDLEGROUND_OFFSET;
        this.background = new Layer(images.get(ImageName.Background));
        this.distance = 0;
        this.target = level * Level.TARGET_MULTIPLIER;
        this.score = 0;
        this.obstacles = [];
        this.traffic = [];

        this.distance = 0;
        this.lastSpawn = -1;
        this.lastObstacle = null;
        this.lastPoutine = -1000;

        this.lastScoreDistance = 0;
        this.complete = false;

		this.messageBox = new MessageBox("TARGET DISTANCE: " + Level.formatDistance(this.target, 0));

        canvas.addEventListener(EventName.GameOver, () =>
        {
            // Have to play and stop tires sound here because of weird bug
            if (!settings.muteSound) sounds.stop(SoundName.Tires);
            if (!settings.muteMusic) sounds.stop(SoundName.GameMusic);

            if (this.score > settings.highScores[0])
            {
                settings.highScores[0] = this.score;
            } 

            settings.saveSettings();

            stateMachine.change(GameStateName.GameOver, { level: this, player: this.player });
        });
    }

    update(dt)
    {
        this.checkHighScore();

        if (!this.complete)
        {
            if (this.getDistanceM(this.distance) - this.lastScoreDistance >= Level.SCORE_UPDATE_RATE)
            {
                this.score += this.player.getSpeedKMH();
                this.lastScoreDistance = this.getDistanceM(this.distance);
            }
        }

        let newDistanceTraveled = this.player.velocity.x * dt * Level.TIME_SCALE;
        this.distance = (this.distance + newDistanceTraveled);

        this.middleground.position.x = (this.middleground.position.x + (newDistanceTraveled * Level.MG_RATIO)) % Level.MG_LOOP_POINT;
        this.middleground.update(dt);

        this.foreground.position.x = (this.foreground.position.x + newDistanceTraveled) % Level.FG_LOOP_POINT;
        this.foreground.update(dt);

        this.updateObstacles(dt);

        if (!this.complete) this.spawnRandomObstacles();

        this.cleanUpObstacles();

        if (!this.complete) this.checkWin();
    }

    render()
    {
        this.background.render();
        this.middleground.render();
        this.foreground.render();

        this.renderObstacles();
        this.player.render();

		this.messageBox.render();
    }

    // Formats a distance from M to KM with optional decimals.
    static formatDistance(distanceInMeters, decimals = 0)
    {
        if (distanceInMeters >= 1000)
        {
            return `${(distanceInMeters / 1000).toFixed(decimals)}KM`;
        }
        else return `${distanceInMeters}M`;
    }

    // Get distance in meters
    getDistanceM(distance)
    {
        const MAGIC_NUMBER = 40;

        let meters = Math.trunc(distance / MAGIC_NUMBER);

        return meters;
    }

    // Gets the current distance and formats it
    getFormattedDistance()
    {
        let distance = this.getDistanceM(this.distance);

        return Level.formatDistance(distance, 2);
    }

    // Ensures obstacles don't spawn too close, or too often (depending on the type).
    spawnRandomObstacles()
    {
        let lastSpawnInMeters = this.getDistanceM(this.lastSpawn);
        let distanceInMeters = this.getDistanceM(this.distance);

        let currentAmount = this.obstacles.length;

        if (distanceInMeters - lastSpawnInMeters > Level.MAX_SPAWNRATE) ObstacleFactory.spawnObstacles(this.obstacles);

        if (this.obstacles.length > currentAmount) // If a new obstacle spawned
        {
            if (this.obstacles[this.obstacles.length - 1].constructor.name === "Poutine")
            {
                // Poutines must be minimum 1KM apart
                if (distanceInMeters - this.lastPoutine < 1000)
                {
                    this.obstacles.pop(); // Just push a pothole or cone instead
                    if (oneInXChance(2)) this.obstacles.push(ObstacleFactory.getPothole());
                    else this.obstacles.push(ObstacleFactory.getCone());
                }
            }

            if (this.obstacles[this.obstacles.length - 1].constructor.name === this.lastObstacle) 
            {
                // Don't spawn two oil slicks in a row
                if (this.lastObstacle == "OilSlick")
                {
                    this.obstacles.pop(); // Just push a pothole or cone instead
                    if (oneInXChance(2)) this.obstacles.push(ObstacleFactory.getPothole());
                    else this.obstacles.push(ObstacleFactory.getCone());
                }
            }
        }

        if (this.obstacles.length > 0) this.lastObstacle = this.obstacles[this.obstacles.length - 1].constructor.name;

        if (this.lastObstacle === "Poutine") this.lastPoutine = distanceInMeters;

        if (this.obstacles.length > currentAmount) this.lastSpawn = this.distance;
    }

    // Updates obstacle positions based on player speed.
    updateObstacles(dt)
    {
        for (let i = 0; i < this.obstacles.length; i++)
        {
            let newDistanceTraveled = this.player.velocity.x * dt * Level.TIME_SCALE;
            this.obstacles[i].position.x -= newDistanceTraveled;

            this.obstacles[i].update(dt);

            if (this.player.hitbox.didCollide(this.obstacles[i].hitbox))
            {
                // Play tires sound in level because of weird bug
                if (this.obstacles[i] instanceof OilSlick)
                {
                    // Only upon first colliding and not if the player is already slipping
                    if (!this.obstacles[i].isColliding && !this.player.isSlipping)
                    {
                        if (!settings.muteSound) sounds.stop(SoundName.Tires);
                        if (!settings.muteSound) sounds.play(SoundName.Tires);
                    }
                }

                this.obstacles[i].collisionAction(this.player, this);
            }
            else this.obstacles[i].isColliding = false;
        }
    }

    renderObstacles()
    {
        for (let i = 0; i < this.obstacles.length; i++)
        {
            this.obstacles[i].render();
        }
    }

    cleanUpObstacles()
    {
        this.obstacles = this.obstacles.filter((obstacle) => 
        {
            return !obstacle.shouldCleanUp;
        });
    }

    checkWin()
    {
        if (this.getDistanceM(this.distance) >= this.level * Level.TARGET_MULTIPLIER)
        {
            this.complete = true;
            settings.currentLevel++;

            if (!settings.muteMusic) sounds.stop(SoundName.GameMusic);
            if (!settings.muteSound) sounds.play(SoundName.Fanfare);

            settings.totalDistance += this.getDistanceM(this.distance);

            // All-time highest score?
            if (this.score > settings.highScores[0])
            {
                settings.highScores[0] = this.score;
            }

            settings.saveSettings();

            stateMachine.change(GameStateName.Victory, { score: this.score, level: this });
        }
    }

    checkHighScore()
    {
        const WAIT_TIME = 2;

        let dist = this.getDistanceM(this.distance); // # of meters

        let index = Math.trunc(dist / 1000); // # of kilometers

        if (index >= 1)
        {
            if (dist % 1000 === 0 && index <= 10) // Is the user at 1000, 2000, 3000 ... 10K?
            {
                if (this.score > settings.highScores[index])
                {
                    settings.highScores[index] = this.score;
                    settings.saveSettings();

                    this.messageBox.text = `NEW HIGH SCORE FOR LEVEL ${index}!`;
                    this.messageBox.isTweening = true;

                    timer.tween(this.messageBox.position, ['y'], [MessageBox.POS_Y], 0.5, () =>
                    {
                        timer.wait(WAIT_TIME, () =>
                        {
                            timer.tween(this.messageBox.position, ['y'], [MessageBox.OFFSCREEN_Y], 0.5, 
                            () => { this.messageBox.isTweening = false; });
                        });
                    });
                }
            }
        }
    }
}