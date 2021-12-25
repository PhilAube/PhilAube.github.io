import State from "../../lib/State.js";
import FontName from "../enums/FontName.js";
import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, context, gamepad, keys, settings, sounds, stateMachine, timer } from "../globals.js";
import TitleScreenMenu from "../objects/Menus/TitleScreenMenu.js";
import EventName from "../enums/EventName.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";

export default class TitleScreenState extends State {
	static TITLE_SIZE = 50;
	static SUBTITLE_SIZE = 25;
	static COLOR_DELAY = 0.2;
	static TITLE_Y = CANVAS_HEIGHT / 4;
	static colors = ["limegreen", "gold", "red", "magenta", "cyan"];

	constructor() 
	{
		super();

		this.menu = new TitleScreenMenu();

		this.colorTimer = 0;

		this.currentColor = 0;

		this.isTweening = false;

		this.alpha = 1;

		canvas.addEventListener(EventName.Play, () =>
		{
			this.isTweening = true;

			this.alpha = 0;

			timer.tween(this, ['alpha'], [1], 1, () =>
			{
				keys.Enter = false;
				this.isTweening = false;

				stateMachine.change(GameStateName.CarSelect);
			});
		});
	}

	enter(params)
	{
		settings.checkCorruption(); // Refresh settings to check for corruption

		this.menu.holding = true;

		if (params.fade)
		{
			this.isTweening = true;

			timer.tween(this, ['alpha'], [0], 1, () =>
			{
				this.isTweening = false;
	
				if (params.playMusic) sounds.play(SoundName.MenuMusic);
			});
		}
	}

	update(dt)
	{
		timer.update(dt);
		this.colorTimer += dt;

		if (!this.isTweening) 
		{
			if (!this.menu.holding)
			{
				this.menu.update(dt);
			}
			else if (!keys.Enter && !keys.ArrowUp && !keys.ArrowDown) this.menu.holding = false;
		}
	}

	render()
	{
		context.textAlign = "center";

		this.menu.render();

		this.renderTitle();

		context.save();
		context.globalAlpha = this.alpha;
		context.fillStyle = 'black';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.restore();

		gamepad.notificationBox.render();
	}

	renderTitle()
	{
		if (this.colorTimer > TitleScreenState.COLOR_DELAY)
		{
			this.currentColor++;
			this.colorTimer %= TitleScreenState.COLOR_DELAY;
			this.currentColor %= TitleScreenState.colors.length;
		}

		context.fillStyle = TitleScreenState.colors[this.currentColor];
		context.font = `${TitleScreenState.TITLE_SIZE}px ${FontName.Joystix}`;
		context.fillText("MONTREAL SIMULATOR", CANVAS_WIDTH / 2, TitleScreenState.TITLE_Y - 60);

		context.fillStyle = 'white';
		context.font = `${TitleScreenState.SUBTITLE_SIZE}px ${FontName.Joystix}`;
		context.fillText("1.1", CANVAS_WIDTH / 2, TitleScreenState.TITLE_Y - 20);
		context.fillText("DEVELOPED BY PHIL AUBE", CANVAS_WIDTH / 2, TitleScreenState.TITLE_Y + 40);
	}
}
