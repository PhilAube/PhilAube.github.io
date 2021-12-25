import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import FontName from "../enums/FontName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, gamepad, keys, settings, sounds, stateMachine, timer } from "../globals.js";
import StatsPanel from "../objects/StatsPanel.js";
import MessageBox from "../objects/MessageBox.js";
import Visibility from "../services/Visibility.js";

export default class PlayState extends State {
	static HUD_TEXT_SIZE = 25;
	static HUD_Y = 30;

    static HEALTH_BAR_OFFSET = { x: 200, y: 35 };
	
	constructor() 
	{
		super();

		this.player;
		this.level;
		this.isTweening = false;
		this.alpha = 1; // Black rectangle alpha

        this.statsPanel;

		this.holding = false;
	}

	enter(params)
	{
		settings.checkCorruption(); // Refresh settings to check for corruption

		const WAIT_TIME = 2; // In seconds

		this.holding = true;

		this.player = params.player;
		this.level = params.level;
		this.level.player = this.player;

        this.statsPanel = new StatsPanel({ x: PlayState.HEALTH_BAR_OFFSET.x, y: 0 }, this.player);

		if (params.fade) 
		{
			this.alpha = 1; // Black rectangle alpha

			this.isTweening = true;

			timer.tween(this, ['alpha'], [0], 1, () =>
			{
				this.isTweening = false;

				if (!Visibility.isHidden())
				{
					if (!settings.muteMusic) sounds.play(SoundName.GameMusic);
				}
				
				timer.tween(this.level.messageBox.position, ['y'], [CANVAS_HEIGHT - 50], 0.5, () =>
				{
					timer.wait(WAIT_TIME, () =>
					{
						timer.tween(this.level.messageBox.position, ['y'], [MessageBox.OFFSCREEN_Y], 0.5);
					})
				});
			});
		}
	}

	update(dt)
	{
		let newState = gamepad.getCurrentState();

		timer.update(dt);

		if (!this.isTweening)
		{
			if (!this.holding)
			{
				if (keys.Enter || newState?.start)
				{
					if (!settings.muteMusic) sounds.pause(SoundName.GameMusic);
					if (!settings.muteSound) sounds.play(SoundName.Poutine);
	
					if (this.player.isSlipping)
					{
						if (!settings.muteSound) sounds.pause(SoundName.Tires);
					}
					
					stateMachine.change(GameStateName.PauseScreen, { player: this.player, level: this.level });
				}
			}
			else if (!keys.Enter && !newState?.start) this.holding = false;

			this.level.update(dt);
			this.player.update(dt);
		}
	}

	render()
	{
		context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		context.save();

		this.level.render();

		context.restore();

		this.renderHUD();

		context.save();
		context.globalAlpha = this.alpha;
		context.fillStyle = 'black';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.restore();

		gamepad.notificationBox.render();
	}

	renderHUD()
	{
		context.fillStyle = 'white';
		context.font = `${PlayState.HUD_TEXT_SIZE}px ${FontName.Joystix}`;
		context.textAlign = 'left';
		context.fillText(` ${this.player.getSpeedKMH()} KM/H`, 0, PlayState.HUD_Y);
		
		context.textAlign = 'right';
		context.fillText(`${this.level.getFormattedDistance()} `, CANVAS_WIDTH, PlayState.HUD_Y);

		context.fillStyle = 'black';
		context.fillRect(350, -50, 300, 100);
		context.strokeStyle = 'gray';
		context.lineWidth = 2;
		context.strokeRect(350, -50, 300, 100);

		context.fillStyle = 'white';
		context.textAlign = 'center';
		context.fillText(`${this.level.score}`, CANVAS_WIDTH / 2, PlayState.HUD_Y - 5);

        this.statsPanel.renderStatBars(this.player.currentHealth, PlayState.HEALTH_BAR_OFFSET.y);
	}
}