// WEB PROGRAMMING 1 PROJECT 
// DEVELOPED BY : PHIL AUBE

function winScreen() 
{
    const FINALLEVEL = 5;

    const line1Y = (CANVAS_SIZE / 10) * 3;
    const line2Y = (CANVAS_SIZE / 3) * 2;
    const line3Y = (CANVAS_SIZE / 4) * 3;

    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.strokeStyle = GREEN;
    ctx.lineWidth = 2;
    
    if (game.levelNumber === FINALLEVEL) ctx.strokeText("YOU WON!", MID_CANVAS, line1Y);
    else ctx.strokeText("LEVEL COMPLETE!", MID_CANVAS, line1Y);

    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 1;

    if (game.levelNumber === FINALLEVEL || game.levelNumber === 420) ctx.strokeText("PRESS 1 TO PLAY AGAIN", MID_CANVAS, line2Y);
    else ctx.strokeText("PRESS 1 TO GO TO THE NEXT LEVEL", MID_CANVAS, line2Y);

    ctx.strokeText("PRESS 2 TO RETURN TO MENU", MID_CANVAS, line3Y);
}

// Handles any key presses on win screen.
function winScreenKeyHandler(key) 
{
    const FINALLEVEL = 5;
    if (game.allowKeyPress)
    {
        switch (key)
        {
            case '1':
                game.context = '4';
                if (game.levelNumber === FINALLEVEL) game.levelNumber = 0;
                else if (game.levelNumber === 420) 
                {
                    game.context = '6';
                    resetLevelEditor();
                }
                else game.levelNumber++;
                break;
            case '2':
                game.context = '0';
                game.levelNumber = 0;
                game.lastTimedEvent = 0;
                break;
            default:
                break;
        }
    }
}