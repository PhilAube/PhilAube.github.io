import EventName from "../../enums/EventName.js";
import FontName from "../../enums/FontName.js";
import { canvas, CANVAS_WIDTH, context } from "../../globals.js";
import Menu from "./Menu.js";

export default class GameOverMenu extends Menu
{
    static HEADER_SIZE = 35;
    static TEXT_SIZE = 25;

    static POS = { x: 300, y: 250 };
    static DIM = { x: 400, y: 300 };

    static HEADER_OFFSET = 45;
    static RETRY_OFFSET = 190;
    static QUIT_OFFSET =  250;

    constructor()
    {
        super(true, GameOverMenu.POS, GameOverMenu.DIM);

        this.menuOptions = [this.retry, this.quit];

        this.score;
    }

    update(dt)
    {
        // Only allow input when done tweening
        if (this.position.x === GameOverMenu.POS.x && this.position.y === GameOverMenu.POS.y) super.update(dt);
    }

    render()
    {
        super.render();
    }

    renderText()
    {
        context.textAlign = "center";
        context.fillStyle = 'white';

		context.font = `${GameOverMenu.HEADER_SIZE}px ${FontName.Joystix}`;
		context.fillText("GAME OVER!", CANVAS_WIDTH / 2, this.position.y + GameOverMenu.HEADER_OFFSET);

		context.font = `${GameOverMenu.TEXT_SIZE}px ${FontName.Joystix}`;
		context.fillText(`SCORE: ${this.score}`, CANVAS_WIDTH / 2, this.position.y + GameOverMenu.HEADER_OFFSET + 50);
		context.fillText(`DISTANCE: ${this.distance}`, CANVAS_WIDTH / 2, this.position.y + GameOverMenu.HEADER_OFFSET + 90);

		context.fillText("RETRY", CANVAS_WIDTH / 2, this.position.y + GameOverMenu.RETRY_OFFSET);
		context.fillText("QUIT", CANVAS_WIDTH / 2, this.position.y + GameOverMenu.QUIT_OFFSET);
    }

    renderCursor()
    {
        let pos = { x: 0, y: 0 };
		let len = 0;

		switch (this.cursor)
		{
			case 0:
				len = context.measureText("RETRY").width;
				pos = { x: CANVAS_WIDTH / 2 - (len / 2), y: this.position.y + GameOverMenu.RETRY_OFFSET + Menu.CURSOR_OFFSET };
				break;

			case 1:
				len = context.measureText("QUIT").width;
				pos = { x: (CANVAS_WIDTH / 2) - (len / 2), y: this.position.y + GameOverMenu.QUIT_OFFSET + Menu.CURSOR_OFFSET };
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

    retry()
    {
        canvas.dispatchEvent(new CustomEvent(EventName.GameOverRetry));
    }

    quit()
    {
        canvas.dispatchEvent(new CustomEvent(EventName.GameOverQuit));
    }
}