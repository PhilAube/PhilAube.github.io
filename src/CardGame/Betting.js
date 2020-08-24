// * This file contains all the code related to placing bets. * //

function wager()
{
    drawBox("PLACE YOUR BET");

    if (Game.bet > Game.bank)
    {
        Game.bet = Game.bank;
    }

    canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawLeftArrow('#CCC', MID_CANVAS - 125, 200);

    canvasObjs[2].isHovered ? canvasObjs[2].hoverCallback() : drawRightArrow('#CCC', MID_CANVAS + 75, 200);

    canvasObjs[3].isHovered ? canvasObjs[3].hoverCallback() : drawChip(MID_CANVAS, 225, Game.bet, '#AA0000');

    switch(Game.betIncrement)
    {
        case 10:
            drawIncrementBox(MID_CANVAS - 100, '#777', 10);
            canvasObjs[5].isHovered ? canvasObjs[5].hoverCallback() : drawIncrementBox(MID_CANVAS - 25, 'white', 100);
            canvasObjs[6].isHovered ? canvasObjs[6].hoverCallback() : drawIncrementBox(MID_CANVAS + 50, 'white', 1000);
            break;

        case 100:
            canvasObjs[4].isHovered ? canvasObjs[4].hoverCallback() : drawIncrementBox(MID_CANVAS - 100, 'white', 10);
            drawIncrementBox(MID_CANVAS - 25, '#777', 100);
            canvasObjs[6].isHovered ? canvasObjs[6].hoverCallback() : drawIncrementBox(MID_CANVAS + 50, 'white', 1000);
            break;

        case 1000:
            canvasObjs[4].isHovered ? canvasObjs[4].hoverCallback() : drawIncrementBox(MID_CANVAS - 100, 'white', 10);
            canvasObjs[5].isHovered ? canvasObjs[5].hoverCallback() : drawIncrementBox(MID_CANVAS - 25, 'white', 100);
            drawIncrementBox(MID_CANVAS + 50, '#777', 1000);
            break;
    }
}

// Creates events for the wager.
function createBettingEvents()
{
    menuButton();

    leftArrow();

    rightArrow();

    betChip();

    tenBox();

    hundredBox();

    thousandBox();

    function menuButton() // Bottom right button to bring you back to Title screen.
    {
        canvasObjs[0] = new CanvasObject(DEFAULT_CANVAS_SIZE / 4 * 3, DEFAULT_CANVAS_SIZE - 65, DEFAULT_CANVAS_SIZE / 4, 65);
        canvasObjs[0].clickCallback = function()
        {
            Game.context = 'TitleScreen';
        
            resetArray();

            resetHand(Game.CPUHand);

            resetHand(Game.userHand);
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
            if (Game.bet - Game.betIncrement >= 0)
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
            if (Game.bet + Game.betIncrement <= Game.bank)
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

    // For bet increments.
    function tenBox()
    {
        canvasObjs[4] = new CanvasObject(MID_CANVAS - 100, MID_CANVAS, 50, 50);
        canvasObjs[4].clickCallback = function()
        {
            Game.betIncrement = 10;
        }
        canvasObjs[4].hoverCallback = function()
        {
            drawIncrementBox(MID_CANVAS - 100, '#CCC', 10);
        }
    }

    // For bet increments.
    function hundredBox()
    {
        canvasObjs[5] = new CanvasObject(MID_CANVAS - 25, MID_CANVAS, 50, 50);
        canvasObjs[5].clickCallback = function()
        {
            Game.betIncrement = 100;
        }
        canvasObjs[5].hoverCallback = function()
        {
            drawIncrementBox(MID_CANVAS - 25, '#CCC', 100);
        }
    }

    // For bet increments.
    function thousandBox()
    {
        canvasObjs[6] = new CanvasObject(MID_CANVAS + 50, MID_CANVAS, 50, 50);
        canvasObjs[6].clickCallback = function()
        {
            Game.betIncrement = 1000;
        }
        canvasObjs[6].hoverCallback = function()
        {
            drawIncrementBox(MID_CANVAS + 50, '#CCC', 1000);
        }
    }
}

// Draws the boxes that set the bet increment value.
function drawIncrementBox(x, color, value)
{
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, MID_CANVAS, 50, 50);
    ctx.fill();

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.rect(x, MID_CANVAS, 50, 50);
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.fillText(value, x + 25, MID_CANVAS + 30)
}

// Deletes events for the wager.
function deleteBettingEvents()
{
    while (canvasObjs.length > 1)
    {
        canvasObjs.pop();
    }
}