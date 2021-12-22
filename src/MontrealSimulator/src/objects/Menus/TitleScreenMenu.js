import EventName from "../../enums/EventName.js";
import FontName from "../../enums/FontName.js";
import GameStateName from "../../enums/GameStateName.js";
import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, context, stateMachine } from "../../globals.js";
import Menu from "./Menu.js";

export default class TitleScreenMenu extends Menu
{
	static TEXT_SIZE = 25;
    static PLAY_Y = CANVAS_HEIGHT / 2 + 50;
	static SETTINGS_Y = CANVAS_HEIGHT / 2 + 150;
	static HIGH_SCORES_Y = CANVAS_HEIGHT / 2 + 250;

    constructor()
    {
        super();

		this.menuOptions = [this.play, this.settings, this.highScores];
    }

    update(dt)
    {
        super.update(dt);
    }

    render()
    {
        super.render();
    }

    renderText()
	{
		context.fillStyle = 'white';
		context.font = `${TitleScreenMenu.TEXT_SIZE}px ${FontName.Joystix}`;

		context.fillText("PLAY", CANVAS_WIDTH / 2, TitleScreenMenu.PLAY_Y);

		context.fillText("SETTINGS", CANVAS_WIDTH / 2, TitleScreenMenu.SETTINGS_Y);

		context.fillText("HIGH SCORES", CANVAS_WIDTH / 2, TitleScreenMenu.HIGH_SCORES_Y);
	}

	renderCursor()
	{
		let pos = { x: 0, y: 0 };
		let len = 0;

		switch (this.cursor)
		{
			case 0:
				len = context.measureText("PLAY").width;
				pos = { x: CANVAS_WIDTH / 2 - (len / 2), y: TitleScreenMenu.PLAY_Y + Menu.CURSOR_OFFSET };
				break;

			case 1:
				len = context.measureText("SETTINGS").width;
				pos = { x: (CANVAS_WIDTH / 2) - (len / 2), y: TitleScreenMenu.SETTINGS_Y + Menu.CURSOR_OFFSET };
				break;

			case 2:
				len = context.measureText("HIGH SCORES").width;
				pos = { x: CANVAS_WIDTH / 2 - (len / 2), y: TitleScreenMenu.HIGH_SCORES_Y + Menu.CURSOR_OFFSET };
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
    
	play() { canvas.dispatchEvent(new CustomEvent(EventName.Play)); }

	settings() { stateMachine.change(GameStateName.SettingsMenu); }

	highScores() { stateMachine.change(GameStateName.HighScores); }
}