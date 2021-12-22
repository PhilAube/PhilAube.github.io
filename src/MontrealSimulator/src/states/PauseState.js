import State from "../../lib/State.js";
import EventName from "../enums/EventName.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, context, settings, sounds, stateMachine, timer } from "../globals.js";
import PauseMenu from "../objects/Menus/PauseMenu.js";

export default class PauseState extends State
{
    static OFFSCREEN_POS = { x: PauseMenu.POS.x, y: CANVAS_HEIGHT };

    constructor() 
	{
		super();

		this.player;
		this.level;
        this.pausePanel = new PauseMenu();
        this.isTweening = false;
        this.alpha = 0;

        canvas.addEventListener(EventName.PauseResume, () =>
        {
            this.isTweening = true;
            timer.tween(this.pausePanel.position, ['y'], [CANVAS_HEIGHT], 0.25, () =>
            { 
                this.isTweening = false;
                if (!settings.muteMusic) sounds.play(SoundName.GameMusic);

                if (this.player.isSlipping)
				{
					if (!settings.muteSound) sounds.play(SoundName.Tires);
				}

                stateMachine.change(GameStateName.Play, { player: this.player, level: this.level });
            });
        });

        canvas.addEventListener(EventName.PauseQuit, () => 
        {
            this.isTweening = true;

            timer.tween(this, ['alpha'], [1], 1, () =>
            {
                if (!settings.muteMusic) sounds.stop(SoundName.GameMusic);
                this.isTweening = false;
                this.alpha = 0;

                this.pausePanel.cursor = 0;
                this.pausePanel.position = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT };

                settings.totalDistance += this.level.getDistanceM(this.level.distance);
                if (this.level.score > settings.highScores[0])
                {
                    settings.highScores[0] = this.level.score;
                }
                settings.saveSettings();

                if (this.player.isSlipping)
				{
					if (!settings.muteSound) sounds.stop(SoundName.Tires);
				}

                stateMachine.change(GameStateName.TitleScreen, { playMusic: !settings.muteMusic, fade: true });
            });
        });
	}

    enter(params)
    {
        settings.checkCorruption(); // Refresh settings to check for corruption

        this.player = params.player;
        this.level = params.level;

        this.pausePanel.position = { x: PauseState.OFFSCREEN_POS.x, y: PauseState.OFFSCREEN_POS.y };
        this.isTweening = true;
        timer.tween(this.pausePanel.position, ['y'], [PauseMenu.POS.y], 0.25, () =>
        { this.isTweening = false; });
    }

    update(dt)
    {
        if (!settings.muteMusic) sounds.pause(SoundName.GameMusic);

        timer.update(dt);
        if (!this.isTweening) this.pausePanel.update(dt);
    }

    render()
    {
		context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        this.level.render();

        this.pausePanel.render();

        context.save();
		context.globalAlpha = this.alpha;
		context.fillStyle = 'black';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.restore();
    }
}