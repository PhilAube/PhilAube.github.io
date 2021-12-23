import SoundName from "../../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, gamepad, keys, settings, sounds } from "../../globals.js";
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
        this.holding = false;
    }

    update(dt)
    {
        if (!this.handleKeyInput())
        {
            this.handleGamepadInput();            
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

    handleKeyInput()
    {
        if (keys.ArrowUp)
		{
            if (!this.holding)
            {
                this.up();
                this.holding = true;
            }

            return true;
		}
		else if (keys.ArrowDown)
		{
            if (!this.holding)
            {
                this.down();			
                this.holding = true;
            }
            
            return true;
		}
        else if (keys.Enter)
        {
            this.enter();
            this.holding = true;
            return true;
        }
        else this.holding = false;
    }

    handleGamepadInput()
    {
        let oldState = {};
        Object.assign(oldState, gamepad);
        let newState = gamepad.getCurrentState();

        if (newState === undefined) return;

        if (!oldState.up)
        {
            if (newState.up) this.up();
        }
        
        if (!oldState.down)
        {
            if (newState.down) this.down();
        }
        
        if (!oldState.enter)
        {
            if (newState.enter) this.enter();
        } 
    }

    up()
    {
        if (!settings.muteSound) sounds.play(SoundName.Select);
        this.cursor = this.cursor === 0 ? this.menuOptions.length - 1 : this.cursor - 1;
    }

    down()
    {
        if (!settings.muteSound) sounds.play(SoundName.Select);
        this.cursor++;
        this.cursor = this.cursor % this.menuOptions.length;
    }

    enter()
    {
        this.menuOptions[this.cursor]();
	    if (!settings.muteSound) sounds.play(SoundName.Poutine);
    }
}