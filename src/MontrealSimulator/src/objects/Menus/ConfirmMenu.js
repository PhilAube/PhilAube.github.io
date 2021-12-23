import EventName from "../../enums/EventName.js";
import FontName from "../../enums/FontName.js";
import GameStateName from "../../enums/GameStateName.js";
import { canvas, CANVAS_WIDTH, context, keys, settings } from "../../globals.js";
import Menu from "./Menu.js";

export default class ConfirmMenu extends Menu
{
    static HEADER_SIZE = 30;
    static TEXT_SIZE = 25;

    static POS = { x: 225, y: 250 };
    static DIM = { x: 550, y: 400 };

    static HEADER_OFFSET = 50;
    static NO_OFFSET = 275;
    static YES_OFFSET =  350;

    constructor(outerMenu)
    {
        super(true, ConfirmMenu.POS, ConfirmMenu.DIM);

        this.outerMenu = outerMenu;

        this.menuOptions = [this.no, this.yes];

        canvas.addEventListener(EventName.ConfirmYes, () =>
        {
            // Reset settings
            settings.currentLevel = 1;
            settings.totalDistance = 0;
            settings.highScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            settings.saveSettings();
            
            this.cursor = 0;
            this.outerMenu.state = GameStateName.SettingsMenu;
            this.outerMenu.holding = true;
            this.holding = true;
        });

        canvas.addEventListener(EventName.ConfirmNo, () =>
        {
            this.cursor = 0;
            this.outerMenu.state = GameStateName.SettingsMenu;
            this.outerMenu.holding = true;
            this.holding = true;
        });
    }

    update(dt)
    {
        if (!this.holding)
        {
            super.update(dt);
        }
        else if (!keys.Enter && !keys.ArrowUp && !keys.ArrowDown)
        {
            this.outerMenu.holding = false;
            this.holding = false;
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

		context.font = `${ConfirmMenu.HEADER_SIZE}px ${FontName.Joystix}`;
		context.fillText("Are you sure?", CANVAS_WIDTH / 2, this.position.y + ConfirmMenu.HEADER_OFFSET);

		context.font = `${ConfirmMenu.TEXT_SIZE}px ${FontName.Joystix}`;
		context.fillText("You will lose all your", CANVAS_WIDTH / 2, this.position.y + ConfirmMenu.HEADER_OFFSET + 70);
		context.fillText("level progress, unlocked", CANVAS_WIDTH / 2, this.position.y + ConfirmMenu.HEADER_OFFSET + 110);
		context.fillText("cars and high scores.", CANVAS_WIDTH / 2, this.position.y + ConfirmMenu.HEADER_OFFSET + 150);

		context.fillText("NO", CANVAS_WIDTH / 2, this.position.y + ConfirmMenu.NO_OFFSET);
		context.fillText("YES", CANVAS_WIDTH / 2, this.position.y + ConfirmMenu.YES_OFFSET);
    }

    renderCursor()
    {
        let pos = { x: 0, y: 0 };
		let len = 0;

		switch (this.cursor)
		{
			case 0:
				len = context.measureText("NO").width;
				pos = { x: CANVAS_WIDTH / 2 - (len / 2), y: this.position.y + ConfirmMenu.NO_OFFSET + Menu.CURSOR_OFFSET };
				break;

			case 1:
				len = context.measureText("YES").width;
				pos = { x: (CANVAS_WIDTH / 2) - (len / 2), y: this.position.y + ConfirmMenu.YES_OFFSET + Menu.CURSOR_OFFSET };
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

    yes()
    {
        canvas.dispatchEvent(new CustomEvent(EventName.ConfirmYes));
    }

    no()
    {
        canvas.dispatchEvent(new CustomEvent(EventName.ConfirmNo));
    }
}