// WEB PROGRAMMING 1 PROJECT 
// DEVELOPED BY : PHIL AUBE

function titleScreen()
{
    cycleColors();

    drawTitle(game.color);

    writeInfo(game.color);

    game.lastTimedEvent++;
}

// Alternates between magenta and cyan every 60 frames.
function cycleColors() 
{
    switch (game.lastTimedEvent)
    {
        case 0:
            game.color = CYAN;
            break;
        case 60  :
            game.color = MAGENTA;
            break;
        case 120 :
            game.color = CYAN;
            game.lastTimedEvent = 0;
            break;
        default:
            break;
    }
}

// Simply draws the title.
function drawTitle(color)
{
    const TITLE_Y = (CANVAS_SIZE / 10) * 3;

    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeText("TIMEWASTER 2", MID_CANVAS, TITLE_Y);
}

// Outputs additional info.
function writeInfo(color) 
{
    const line1Y = (CANVAS_SIZE / 10) * 5.5;
    const line2Y = (CANVAS_SIZE / 10) * 6.5;
    const line3Y = (CANVAS_SIZE / 10) * 7.5;
    const line4Y = (CANVAS_SIZE / 10) * 9;

    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    
    ctx.strokeText("PRESS 1 TO PLAY", MID_CANVAS, line1Y);
    ctx.strokeText("PRESS 2 FOR INSTRUCTIONS", MID_CANVAS, line2Y);
    ctx.strokeText("PRESS 3 FOR LEVEL EDITOR", MID_CANVAS, line3Y);
    ctx.strokeText("DEVELOPED BY PHIL AUBE", MID_CANVAS, line4Y);
}

// Handles any key presses on title screen.
function titleScreenKeyHandler(key)
{
    switch (key)
    {
        case '1':
            // Loading screen, then game
            game.context = '4';
            game.levelNumber = 0;
            game.lastTimedEvent = 0;
            break;

        case '2':
            // Instructions
            game.context = key;
            game.lastTimedEvent = 0;
            break;

        case '3':
            // Level editor
            game.context = '6';
            resetLevelEditor();
            break;
        
        default: break;
    }
}