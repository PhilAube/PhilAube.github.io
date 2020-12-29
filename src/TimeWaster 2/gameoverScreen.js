// WEB PROGRAMMING 1 PROJECT 
// DEVELOPED BY : PHIL AUBE

function gameoverScreen() 
{
    const line1Y = (CANVAS_SIZE / 10) * 3;
    const line2Y = (CANVAS_SIZE / 3) * 2;
    const line3Y = (CANVAS_SIZE / 4) * 3;

    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.strokeStyle = MAGENTA;
    ctx.lineWidth = 2;
    ctx.strokeText("GAME OVER", MID_CANVAS, line1Y);

    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 1;
    ctx.strokeText("PRESS 1 TO TRY AGAIN", MID_CANVAS, line2Y);
    ctx.strokeText("PRESS 2 TO RETURN TO MENU", MID_CANVAS, line3Y);
}

// Handles any key presses on game over screen.
function gameoverScreenKeyHandler(key) 
{
    if (game.allowKeyPress)
    {
        switch (key)
        {
            case '1':
                // Loading screen
                game.context = '4';
                game.lastTimedEvent = 0;
                break;
            case '2':
                // Title screen
                game.context = '0';
                game.levelNumber = 0;
                game.lastTimedEvent = 0;
                break;
            default:
                break;
        }
    }
}