import State from "../../lib/State.js";
import FontName from "../enums/FontName.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, keys, settings, sounds, stateMachine } from "../globals.js";
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
	}

    enter()
    {
        settings.checkCorruption(); // Refresh settings to check for corruption
    }

    update(dt)
    {
        if (keys.Enter)
        {
            keys.Enter = false;
            if (!settings.muteSound) sounds.play(SoundName.Poutine);
            stateMachine.change(GameStateName.TitleScreen, { playMusic: false, fade: false });
        }
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
    }
}