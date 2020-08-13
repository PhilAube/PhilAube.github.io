// * This file contains all the code related to placing bets. * //

function wager()
{
    drawBox();

    if (Game.bet > Game.bank)
    {
        Game.bet = Game.bank;
    }

    canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawLeftArrow('#CCC', MID_CANVAS - 125, 200);

    canvasObjs[2].isHovered ? canvasObjs[2].hoverCallback() : drawRightArrow('#CCC', MID_CANVAS + 75, 200);

    canvasObjs[3].isHovered ? canvasObjs[3].hoverCallback() : drawChip(MID_CANVAS, 225, Game.bet, '#AA0000');

    function drawBox()
    {
        ctx.beginPath();
        ctx.rect(150, 100, 300, 225);
        ctx.fillStyle = '#333';
        ctx.fill();
    
        ctx.beginPath();
        ctx.rect(150, 100, 300, 225);
        ctx.stroke();
    
        ctx.fillStyle = 'white';
        ctx.fillText("PLACE YOUR BET", MID_CANVAS, 150);
    }
}

// Creates events for the wager.
function createBettingEvents()
{
    menuButton();

    leftArrow();

    rightArrow();

    betChip();

    function menuButton()
    {
        canvasObjs[0] = new CanvasObject(DEFAULT_CANVAS_SIZE / 4 * 3, DEFAULT_CANVAS_SIZE - 65, DEFAULT_CANVAS_SIZE / 4, 65);
        canvasObjs[0].clickCallback = function()
        {
            Game.context = 'TitleScreen';
        
            resetArray();
        }
        canvasObjs[0].hoverCallback = function()
        {
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.rect(DEFAULT_CANVAS_SIZE / 4 * 3, DEFAULT_CANVAS_SIZE - 65, DEFAULT_CANVAS_SIZE / 4, 65);
            ctx.fill();

            ctx.fillStyle = '#111';
            ctx.font = "20px Arial";
            ctx.fillText("MENU", DEFAULT_CANVAS_SIZE / 8 * 7, DEFAULT_CANVAS_SIZE - 25);
        }
    }

    // Decreases bet by the increment.
    function leftArrow()
    {
        canvasObjs[1] = new CanvasObject(MID_CANVAS - 125, 200, 50, 50);
        canvasObjs[1].clickCallback = function()
        {
            if (Game.bet > 0)
            {
                Game.bet -= Game.betIncrement;
            }
        }
        canvasObjs[1].hoverCallback = function()
        {
            drawLeftArrow('#FFF', MID_CANVAS - 125, 200);
        }
    }

    // Increases bet by the increment.
    function rightArrow()
    {
        canvasObjs[2] = new CanvasObject(MID_CANVAS + 75, 200, 50, 50);
        canvasObjs[2].clickCallback = function()
        {
            if (Game.bet < Game.bank)
            {
                Game.bet += Game.betIncrement;
            }
        }
        canvasObjs[2].hoverCallback = function()
        {
            drawRightArrow('#FFF', MID_CANVAS + 75, 200, MID_CANVAS - 25);
        }
    }

    // Confirms bet.
    function betChip()
    {
        canvasObjs[3] = new CanvasObject(MID_CANVAS, 225, 0, 0, CHIP_RADIUS);
        canvasObjs[3].clickCallback = function()
        {
            if (Game.bet == 0)
            {
                if (Game.bank == 0)
                {
                    alert("You can't play without betting! \nIf you're out of chips, you can beg for some in the SETTINGS.");
                }
                else
                {
                    alert("You can't play without betting!");
                }
            }
            else if (Game.bet > Game.bank)
            {
                alert("You can't bet more chips than you have!");
            }
            else
            {
                Game.counter++;
                Game.bank -= Game.bet;
                localStorage.setItem('bank', Game.bank);
            }
        }
        canvasObjs[3].hoverCallback = function()
        {
            drawChip(MID_CANVAS, 225, "BET", '#0000AA');
        }
    }
}

// Deletes events for the wager.
function deleteBettingEvents()
{
    while (canvasObjs.length > 1)
    {
        canvasObjs.pop();
    }

    Game.counter++;
}