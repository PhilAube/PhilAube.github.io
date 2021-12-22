import State from "../../lib/State.js";
import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, context, settings, stateMachine, timer } from "../globals.js";
import GameStateName from "../enums/GameStateName.js";
import VictoryMenu from "../objects/Menus/VictoryMenu.js";
import EventName from "../enums/EventName.js";
import Player from "../entities/Player.js";
import Level from "../objects/Level.js";
import MessageBox from "../objects/MessageBox.js";

export default class VictoryState extends State 
{
    static OFFSCREEN_POS = { x: VictoryMenu.POS_X, y: CANVAS_HEIGHT };

	static TEXT_SIZE = 25;
	static HEADER_Y = 25;

	constructor() 
	{
		super();

		this.level;
		this.player;

		this.victoryPanel = new VictoryMenu();
        this.isTweening = false;
		this.alpha = 0; // Alpha of the black for transition

        canvas.addEventListener(EventName.VictoryContinue, () =>
        {
            this.isTweening = true;

			timer.tween(this, ['alpha'], [1], 1, () =>
			{
				this.isTweening = false;
				this.alpha = 0;
				let newPlayer = new Player(this.player.type);
				let newLevel = new Level(newPlayer, settings.currentLevel);

				stateMachine.change(GameStateName.Play, 
				{
					player: newPlayer, 
					level: newLevel,
					fade: true
				});
			});
        });

        canvas.addEventListener(EventName.VictoryQuit, () => 
        {
			this.isTweening = true;

			timer.tween(this, ['alpha'], [1], 1, () =>
			{
				this.isTweening = false;
				this.alpha = 0;
				this.victoryPanel.cursor = 0;
				this.victoryPanel.position = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT };
				stateMachine.change(GameStateName.TitleScreen, { playMusic: !settings.muteMusic, fade: true });
			});
        });
	}

	enter(params)
	{
		settings.checkCorruption(); // Refresh settings to check for corruption

		const LAST_LEVEL = 4;
		const WAIT_TIME = 2;

		this.level = params.level;
		this.player = this.level.player;
		this.victoryPanel.score = this.level.score;
		this.victoryPanel.distance = Level.formatDistance(this.level.getDistanceM(this.level.distance));

		if (this.player.isSlipping)
		{
			if (this.player.animation.currentFrame === 1) this.player.animation.currentFrame++;
			else if (this.player.animation.currentFrame === 5) this.player.animation.currentFrame++;
		}

		this.victoryPanel.position = { x: VictoryState.OFFSCREEN_POS.x, y: VictoryState.OFFSCREEN_POS.y };
        this.isTweening = true;
        timer.tween(this.victoryPanel.position, ['y'], [VictoryMenu.POS_Y], 1, () =>
        { 
			this.isTweening = false;

			if (this.level.level < LAST_LEVEL)
			{
				if (this.level.messageBox.isTweening) timer.wait(WAIT_TIME, () =>
				{
					this.level.messageBox.text = "NEW VEHICLES UNLOCKED!";
					this.level.messageBox.isTweening = true;

					timer.tween(this.level.messageBox.position, ['y'], [CANVAS_HEIGHT - 50], 0.5, () =>
					{
						timer.wait(WAIT_TIME, () =>
						{
							timer.tween(this.level.messageBox.position, ['y'], [MessageBox.OFFSCREEN_Y], 0.5);
							this.level.messageBox.isTweening = false;
						})
					});
				})
			}
		});
	}

	update(dt)
	{
		this.level.update(dt);
		this.player.velocity.x = Math.max(0, this.player.velocity.x - 20);

		timer.update(dt);
        if (!this.isTweening) this.victoryPanel.update(dt);
	}

	render()
	{
		context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		this.level.render();
		this.player.render();

        this.victoryPanel.render();

		context.save();
		context.globalAlpha = this.alpha;
		context.fillStyle = 'black';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.restore();
	}
}
