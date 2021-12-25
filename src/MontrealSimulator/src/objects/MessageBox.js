import FontName from "../enums/FontName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context } from "../globals.js";
import CanvasObject from "./CanvasObject.js";

// Base class for menus with a cursor and choices.
export default class MessageBox extends CanvasObject
{
    static HEIGHT = 50;
    static POS_Y = 700; // CANVAS_HEIGHT - 50;
    static OFFSCREEN_Y = 760; // CANVAS_HEIGHT + 10;

    constructor(text, dimensions = { x: CANVAS_WIDTH / 2 + 100, y: MessageBox.HEIGHT })
    {
        super({ x: CANVAS_WIDTH / 2 - (dimensions.x / 2), y: MessageBox.OFFSCREEN_Y }, dimensions);
        this.text = text;
        this.isTweening = false;
    }

    render()
    {
        context.font = `25px ${FontName.Joystix}`;
        context.fillStyle = 'black';
        context.fillRect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);

        context.strokeStyle = '#555';
        context.lineWidth = 5;
        context.strokeRect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);

        context.fillStyle = 'white';
        context.fillText(this.text, CANVAS_WIDTH / 2, this.position.y + 35, CANVAS_WIDTH / 2 + 100);
    }
}