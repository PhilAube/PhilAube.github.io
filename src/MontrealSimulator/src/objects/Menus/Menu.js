import SoundName from "../../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, keys, settings, sounds } from "../../globals.js";
import CanvasObject from "../CanvasObject.js";

// Base class for menus with a cursor and choices.
export default class Menu extends CanvasObject
{
    static CURSOR_OFFSET = 10;

    constructor(border = false, position = { x: 0, y: 0}, dimensions = { x: CANVAS_WIDTH, y: CANVAS_HEIGHT })
    {
        super(position, dimensions);

        this.border = border;
        this.cursor = 0;
        this.menuOptions = [];
    }

    update(dt)
    {
        if (keys.ArrowUp)
		{
			if (!settings.muteSound) sounds.play(SoundName.Select);
			keys.ArrowUp = false;
			this.cursor = this.cursor === 0 ? this.menuOptions.length - 1 : this.cursor - 1;
		}
		else if (keys.ArrowDown)
		{
			if (!settings.muteSound) sounds.play(SoundName.Select);
			keys.ArrowDown = false;
			this.cursor++;
			this.cursor = this.cursor % this.menuOptions.length;
		}
		else if (keys.Enter)
		{
            this.menuOptions[this.cursor]();
			if (!settings.muteSound) sounds.play(SoundName.Poutine);
			keys.Enter = false;
		}
    }

    render()
    {
        context.fillStyle = 'black';
        context.fillRect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);

        if (this.border)
        {
            context.strokeStyle = '#555';
            context.strokeRect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);
        }

        this.renderText();
		
		this.renderCursor();
    }

    renderText()
    {
        // To be overidden based on menu choices
    }

    renderCursor()
    {
        // To be overriden based on menu choices
    }
}