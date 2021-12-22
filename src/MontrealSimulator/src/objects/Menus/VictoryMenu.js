import EventName from "../../enums/EventName.js";
import FontName from "../../enums/FontName.js";
import { canvas, CANVAS_WIDTH, context } from "../../globals.js";
import Menu from "./Menu.js";

export default class VictoryMenu extends Menu
{
    static HEADER_SIZE = 30;
    static TEXT_SIZE = 25;

    static POS_X = 250;
    static POS_Y = 250;
    static DIM = { x: 500, y: 300 };

    static HEADER_OFFSET = 50;
    static CONTINUE_OFFSET = 200;
    static QUIT_OFFSET =  260;

    constructor()
    {
        super(true, { x: VictoryMenu.POS_X, y: VictoryMenu.POS_Y }, VictoryMenu.DIM);

        this.menuOptions = [this.continue, this.quit];

        this.score;
    }

    update(dt)
    {
        // Only allow input when done tweening
        if (this.position.x === VictoryMenu.POS_X && this.position.y === VictoryMenu.POS_Y) super.update(dt);
    }

    render()
    {
        super.render();
    }

    renderText()
    {
        context.textAlign = "center";
        context.fillStyle = 'white';

		context.font = `${VictoryMenu.HEADER_SIZE}px ${FontName.Joystix}`;
		context.fillText("LEVEL COMPLETE!", CANVAS_WIDTH / 2, this.position.y + VictoryMenu.HEADER_OFFSET);

		context.font = `${VictoryMenu.TEXT_SIZE}px ${FontName.Joystix}`;
		context.fillText(`SCORE: ${this.score}`, CANVAS_WIDTH / 2, this.position.y + VictoryMenu.HEADER_OFFSET + 50);
		context.fillText(`DISTANCE: ${this.distance}`, CANVAS_WIDTH / 2, this.position.y + VictoryMenu.HEADER_OFFSET + 90);

		context.fillText("CONTINUE", CANVAS_WIDTH / 2, this.position.y + VictoryMenu.CONTINUE_OFFSET);
		context.fillText("QUIT", CANVAS_WIDTH / 2, this.position.y + VictoryMenu.QUIT_OFFSET);
    }

    renderCursor()
    {
        let pos = { x: 0, y: 0 };
		let len = 0;

		switch (this.cursor)
		{
			case 0:
				len = context.measureText("CONTINUE").width;
				pos = { x: CANVAS_WIDTH / 2 - (len / 2), y: this.position.y + VictoryMenu.CONTINUE_OFFSET + Menu.CURSOR_OFFSET };
				break;

			case 1:
				len = context.measureText("QUIT").width;
				pos = { x: (CANVAS_WIDTH / 2) - (len / 2), y: this.position.y + VictoryMenu.QUIT_OFFSET + Menu.CURSOR_OFFSET };
				break;
		}

		context.strokeStyle = 'white';
		context.lineWidth = 5;

		context.save();

		context.beginPath();
		context.moveTo(pos.x, pos.y);
		context.lineTo(pos.x + len, pos.y);
		context.stroke();

		context.restore();
    }

    continue()
    {
        canvas.dispatchEvent(new CustomEvent(EventName.VictoryContinue));
    }

    quit()
    {
        canvas.dispatchEvent(new CustomEvent(EventName.VictoryQuit));
    }
}