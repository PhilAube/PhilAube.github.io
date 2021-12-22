import State from "../../lib/State.js";
import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, context, settings, stateMachine, timer } from "../globals.js";
import GameStateName from "../enums/GameStateName.js";
import Fire from "../objects/Fire.js";
import GameOverMenu from "../objects/Menus/GameOverMenu.js";
import EventName from "../enums/EventName.js";
import Player from "../entities/Player.js";
import Level from "../objects/Level.js";

export default class GameOverState extends State 
{
    static OFFSCREEN_POS = { x: GameOverMenu.POS.x, y: CANVAS_HEIGHT };

	static TEXT_SIZE = 25;
	static HEADER_Y = 25;

	constructor() 
	{
		super();

		this.level;
		this.player;
		this.fire;

		this.gameOverPanel = new GameOverMenu();
        this.isTweening = false;
		this.alpha = 0; // Alpha of the black for transition

        canvas.addEventListener(EventName.GameOverRetry, () =>
        {
            this.isTweening = true;

			timer.tween(this, ['alpha'], [1], 1, () =>
			{
				this.alpha = 0;
				let newPlayer = new Player(this.player.type);
				let newLevel = new Level(newPlayer, settings.currentLevel)

				stateMachine.change(GameStateName.Play, 
				{
					player: newPlayer, 
					level: newLevel,
					fade: true
				});
			});
        });

        canvas.addEventListener(EventName.GameOverQuit, () => 
        {
			this.isTweening = true;

			timer.tween(this, ['alpha'], [1], 1, () =>
			{
				this.isTweening = false;
				this.alpha = 0;
				this.gameOverPanel.cursor = 0;
				this.gameOverPanel.position = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT };
				stateMachine.change(GameStateName.TitleScreen, { playMusic: !settings.muteMusic, fade: true });
			});
        });
	}

	enter(params)
	{
		settings.checkCorruption(); // Refresh settings to check for corruption

		this.level = params.level;
		this.player = params.player;
		this.fire = new Fire(params.player.position);
		this.gameOverPanel.score = this.level.score;
		this.gameOverPanel.distance = this.level.getFormattedDistance();

		this.gameOverPanel.position = { x: GameOverState.OFFSCREEN_POS.x, y: GameOverState.OFFSCREEN_POS.y };
        this.isTweening = true;
        timer.tween(this.gameOverPanel.position, ['y'], [GameOverMenu.POS.y], 1, () =>
        { this.isTweening = false; });
	}

	update(dt)
	{
		if (this.player.isSlipping)
		{
			if (this.player.animation.currentFrame === 1) this.player.animation.currentFrame++;
			else if (this.player.animation.currentFrame === 5) this.player.animation.currentFrame++;
		}

		this.level.update(dt);
		this.player.velocity.x = Math.max(0, this.player.velocity.x - 200);
		this.fire.update(dt);

		timer.update(dt);
        if (!this.isTweening) this.gameOverPanel.update(dt);
	}

	render()
	{
		context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		this.level.render();
		this.fire.render();
		this.player.render();

        this.gameOverPanel.render();

		context.save();
		context.globalAlpha = this.alpha;
		context.fillStyle = 'black';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.restore();
	}
}
