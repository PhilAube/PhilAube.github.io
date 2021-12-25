import State from "../../lib/State.js";
import FontName from "../enums/FontName.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, gamepad, keys, settings, sounds, stateMachine, timer } from "../globals.js";
import Level from "../objects/Level.js";

export default class HighScoreState extends State
{
    static HEADER_SIZE = 35;
    static TEXT_SIZE = 25;

    static TABLE_Y = 240;

    static LEVEL_COLUMN = 250;
    static SCORE_COLUMN = CANVAS_WIDTH - 250;

    constructor() 
	{
		super();
        this.holding = false;
	}

    enter()
    {
        this.holding = true;
        settings.checkCorruption(); // Refresh settings to check for corruption
    }

    update(dt)
    {
		timer.update(dt);

        if (!this.holding)
        {
            if (keys.Enter)
            {
                if (!settings.muteSound) sounds.play(SoundName.Poutine);
                stateMachine.change(GameStateName.TitleScreen, { playMusic: false, fade: false });
            }
            else this.handleGamepadInput();
        }
        else if (!keys.Enter) this.holding = false;
    }

    render()
    {
        context.textAlign = 'center';
		context.fillStyle = 'black';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        context.fillStyle = 'white';
		context.font = `${HighScoreState.HEADER_SIZE}px ${FontName.Joystix}`;
        context.fillText("HIGH SCORES", CANVAS_WIDTH / 2, 50);

		context.font = `${HighScoreState.TEXT_SIZE}px ${FontName.Joystix}`;
        context.fillText(`TOTAL DISTANCE TRAVELLED: ${Level.formatDistance(settings.totalDistance, 2)}`, CANVAS_WIDTH / 2, 100);

        context.fillText("ALL-TIME HIGHEST SCORE: " + settings.highScores[0], CANVAS_WIDTH / 2, 150, CANVAS_WIDTH);

        for (let i = 1; i < settings.highScores.length; i++)
        {
            let y = HighScoreState.TABLE_Y + 40 * (i - 1);

            context.textAlign = 'left';
            context.fillText(`LEVEL ${i}`, HighScoreState.LEVEL_COLUMN, y);

            context.textAlign = 'right';
            context.fillText(settings.highScores[i],HighScoreState.SCORE_COLUMN, y);
        }

        context.textAlign = 'center';
        context.fillText("PRESS ENTER TO RETURN", CANVAS_WIDTH / 2, CANVAS_HEIGHT - 50);

		gamepad.notificationBox.render();
    }

    handleGamepadInput()
    {
        let oldState = {};
        Object.assign(oldState, gamepad);
        let newState = gamepad.getCurrentState();

        if (newState === undefined) return;
        
        if (!oldState.start)
        {
            if (newState.start)
            {
                if (!settings.muteSound) sounds.play(SoundName.Poutine);
                stateMachine.change(GameStateName.TitleScreen, { playMusic: false, fade: false });
            }
        } 
    }
}