import EventName from "../../enums/EventName.js";
import FontName from "../../enums/FontName.js";
import { canvas, CANVAS_WIDTH, context, keys } from "../../globals.js";
import Menu from "./Menu.js";

export default class PauseMenu extends Menu
{
    static HEADER_SIZE = 35;
    static TEXT_SIZE = 25;

    static POS = { x: 300, y: 250 };
    static DIM = { x: 400, y: 250 };

    static HEADER_OFFSET = 50;
    static RESUME_OFFSET = 125;
    static QUIT_OFFSET =  200;

    constructor()
    {
        super(true, PauseMenu.POS, PauseMenu.DIM);

        this.menuOptions = [this.resume, this.quit];
    }

    update(dt)
    {
        // Only allow input when done tweening
        if (this.position.x === PauseMenu.POS.x && this.position.y === PauseMenu.POS.y)
        {
            if (!this.holding)
            {
                super.update(dt);
            }
            else if (!keys.Enter && !keys.ArrowUp && !keys.ArrowDown)
            {
                this.holding = false;
            } 
        }
    }

    render()
    {
        super.render();
    }

    renderText()
    {
        context.textAlign = "center";
        context.fillStyle = 'white';

		context.font = `${PauseMenu.HEADER_SIZE}px ${FontName.Joystix}`;
		context.fillText("PAUSE", CANVAS_WIDTH / 2, this.position.y + PauseMenu.HEADER_OFFSET);

		context.font = `${PauseMenu.TEXT_SIZE}px ${FontName.Joystix}`;
		context.fillText("RESUME", CANVAS_WIDTH / 2, this.position.y + PauseMenu.RESUME_OFFSET);
		context.fillText("QUIT", CANVAS_WIDTH / 2, this.position.y + PauseMenu.QUIT_OFFSET);
    }

    renderCursor()
    {
        let pos = { x: 0, y: 0 };
		let len = 0;

		switch (this.cursor)
		{
			case 0:
				len = context.measureText("RESUME").width;
				pos = { x: CANVAS_WIDTH / 2 - (len / 2), y: this.position.y + PauseMenu.RESUME_OFFSET + Menu.CURSOR_OFFSET };
				break;

			case 1:
				len = context.measureText("QUIT").width;
				pos = { x: (CANVAS_WIDTH / 2) - (len / 2), y: this.position.y + PauseMenu.QUIT_OFFSET + Menu.CURSOR_OFFSET };
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

    resume()
    {
        
        canvas.dispatchEvent(new CustomEvent(EventName.PauseResume));
    }

    quit()
    {
        canvas.dispatchEvent(new CustomEvent(EventName.PauseQuit));
    }
}