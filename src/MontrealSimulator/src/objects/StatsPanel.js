import FontName from "../enums/FontName.js";
import { context } from "../globals.js";
import CanvasObject from "./CanvasObject.js";

export default class StatsPanel extends CanvasObject
{
    static DIMENSIONS = { x: 600, y: 350 };
    static HEADER_SIZE = 50;
    static TEXT_SIZE = 25;

    static BAR_WIDTH = 50;
    static BAR_HEIGHT = 10;
    static BAR_GAP = 100;
    static BARS_PADDING = 150;

    constructor(position, car)
    {
        super(position, StatsPanel.DIMENSIONS);
        this.car = car;
    }

    render()
    {
        const MID_PANEL = this.position.x + StatsPanel.DIMENSIONS.x / 2;

		context.fillStyle = '#222';
		context.fillRect(this.position.x, this.position.y, StatsPanel.DIMENSIONS.x, StatsPanel.DIMENSIONS.y);

		context.strokeStyle = '#555';
		context.strokeRect(this.position.x, this.position.y, StatsPanel.DIMENSIONS.x, StatsPanel.DIMENSIONS.y);
        
		context.fillStyle = 'white';
		context.font = `${StatsPanel.HEADER_SIZE}px ${FontName.Joystix}`;
		context.fillText("STATS", MID_PANEL, this.position.y + 60);
		context.font = `${StatsPanel.TEXT_SIZE}px ${FontName.Joystix}`;

		context.fillText("HEALTH", MID_PANEL, this.position.y + 125);
        this.renderStatBars(this.car.stats.health, this.position.y + 150);

		context.fillText("TOP SPEED", MID_PANEL, this.position.y + 200);
        this.renderStatBars(this.car.stats.topSpeed, this.position.y + 225);

		context.fillText("ACCELERATION", MID_PANEL, this.position.y + 275);
        this.renderStatBars(this.car.stats.acceleration, this.position.y + 300);
    }

    renderStatBars(stat, y)
    {
        const x = this.position.x + StatsPanel.BARS_PADDING;

        this.renderBarsBkg(x, y);

        this.renderBarColors(stat, x, y);
    }

    renderBarsBkg(x, y)
    {
        const margin = 25;

        context.save();

        context.fillStyle = 'gray';

        for (let i = 0; i < 3; i++)
        {
            let xPos = margin + x + (StatsPanel.BAR_GAP * i);
            context.fillRect(xPos, y, StatsPanel.BAR_WIDTH, StatsPanel.BAR_HEIGHT);
        }

        context.restore();
    }

    renderBarColors(stat, x, y)
    {
        const margin = 25;

        context.save();

        switch (stat)
        {
            case 3:
                context.fillStyle = 'limegreen';
                break;

            case 2:
                context.fillStyle = 'gold';
                break;

            case 1:
                context.fillStyle = 'red';
                break;
        }

        for (let i = 0; i < stat; i++)
        {
            let xPos = margin + x + (StatsPanel.BAR_GAP * i);
            context.fillRect(xPos, y, StatsPanel.BAR_WIDTH, StatsPanel.BAR_HEIGHT);
        }

        context.restore();
    }
}