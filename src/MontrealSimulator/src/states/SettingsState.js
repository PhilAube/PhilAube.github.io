import State from "../../lib/State.js";
import FontName from "../enums/FontName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, gamepad, keys, settings, timer } from "../globals.js";
import SettingsMenu from "../objects/Menus/SettingsMenu.js";

export default class SettingsState extends State {
	static HEADER_Y = 150;
    static HEADER_TEXT_SIZE = 35;

	constructor() 
	{
		super();

		this.menu = new SettingsMenu();
	}

	enter()
	{
		this.menu.holding = true;

		settings.checkCorruption(); // Refresh settings to check for corruption
	}

	update(dt)
	{
		timer.update(dt);
		
		if (!this.menu.holding)
		{
			this.menu.update(dt);
		}
		else if (!keys.Enter && !keys.ArrowUp && !keys.ArrowDown) this.menu.holding = false;
	}

	render()
	{
		context.fillStyle = 'black';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		this.menu.render();

		context.fillStyle = 'white';
		context.font = `${SettingsState.HEADER_TEXT_SIZE}px ${FontName.Joystix}`;
		context.fillText("SETTINGS", CANVAS_WIDTH / 2, SettingsState.HEADER_Y);

		gamepad.notificationBox.render();
	}
}
