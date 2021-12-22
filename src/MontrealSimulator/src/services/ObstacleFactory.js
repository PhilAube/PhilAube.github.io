import OilSlick from "../objects/Obstacles/OilSlick.js";
import { getRandomPositiveInteger, oneInXChance } from "../../lib/RandomNumberHelpers.js";
import Player from "../entities/Player.js";
import Pothole from "../objects/Obstacles/Pothole.js";
import Poutine from "../objects/Obstacles/Poutine.js";
import Cone from "../objects/Obstacles/Cone.js";

export default class ObstacleFactory
{
    static X_MIN = 1000;
    static X_MAX = 1500;

    static POUTINE_SPAWNRATE = 20;
    static OIL_SLICK_SPAWNRATE = 10;
    static CONE_SPAWNRATE = 2;
    static POTHOLE_SPAWNRATE = 1;

    static getRandomCoordinates(offset = { bottom: 0, top: 0 })
    {
        let x = getRandomPositiveInteger(ObstacleFactory.X_MIN, ObstacleFactory.X_MAX);
        let y = getRandomPositiveInteger(Player.ROAD_TOP + offset.top, Player.ROAD_BOTTOM + offset.bottom);
        return { x: x, y: y };
    }

    static getOilSlick()
    {
        return new OilSlick(ObstacleFactory.getRandomCoordinates({ bottom: -25, top: -25 }));
    }

    static getPothole()
    {
        return new Pothole(ObstacleFactory.getRandomCoordinates({ bottom: 50, top: 50 }));
    }

    static getPoutine()
    {
        return new Poutine(ObstacleFactory.getRandomCoordinates({ bottom: 50, top: 50 }));
    }

    static getCone()
    {
        return new Cone(ObstacleFactory.getRandomCoordinates({ bottom: 75, top: 75 }));
    }

    static spawnObstacles(obstacles)
    {
        if (oneInXChance(ObstacleFactory.POUTINE_SPAWNRATE))
        {
            obstacles.push(ObstacleFactory.getPoutine());
            return;
        }

        if (oneInXChance(ObstacleFactory.OIL_SLICK_SPAWNRATE))
        {
            obstacles.push(ObstacleFactory.getOilSlick());
            return;
        }

        if (oneInXChance(ObstacleFactory.CONE_SPAWNRATE))
        {
            obstacles.push(ObstacleFactory.getCone());
            return;
        }

        if (oneInXChance(ObstacleFactory.POTHOLE_SPAWNRATE))
        {
            obstacles.push(ObstacleFactory.getPothole());
        }
    }
}