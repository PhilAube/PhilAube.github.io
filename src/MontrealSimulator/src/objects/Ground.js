import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Layer from "./Layer.js";

export default class Ground
{    
    static GRASS_Y = 350;
    static ROAD_Y = 400;

    constructor()
    {
        this.grass = new Layer(images.get(ImageName.Grass), 3);
        this.grass.position.y = Ground.GRASS_Y;
        this.road = new Layer(images.get(ImageName.Road), 3);
        this.road.position.y = Ground.ROAD_Y;

        this.position = { x: 0, y: 0 };
    }

    update(dt)
    {
        this.grass.position.x = this.position.x;
        this.grass.update(dt);
        this.road.position.x = this.position.x;
        this.road.update(dt);
    }

    render()
    {
        this.grass.render();
        this.road.render();
    }
}