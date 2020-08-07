// * This file contains the instruction menus for BlackJack and Poker. //

// This is the array of instruction pages, as well as the page tracker.
let outputInstructionPages = [];
let pageIndex = 0;

// Upon clicking the "POKER" chip on the MORE screen.
function pokerInstructions()
{
    const INSTRUCTIONS_Y = 100;

    outputInstructionPages = 
    [
        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("POKER PAGE 1", DEFAULT_CANVAS_SIZE / 2, DEFAULT_CANVAS_SIZE / 2);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("POKER PAGE 2", DEFAULT_CANVAS_SIZE / 2, DEFAULT_CANVAS_SIZE / 2);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("POKER PAGE 3", DEFAULT_CANVAS_SIZE / 2, DEFAULT_CANVAS_SIZE / 2);
        },
    ];

    // Will only create the object array once upon loading
    if (Game.counter === 0)
    {
        createInstructionsEvents();
        Game.counter++;
    }

    drawBG();

    ctx.fillStyle = 'white';
    ctx.font = "30px Arial";
    ctx.fillText("POKER INSTRUCTIONS", DEFAULT_CANVAS_SIZE / 2, INSTRUCTIONS_Y);

    outputInstructionPages[pageIndex]();

    drawInstructionsChips();
}

// Upon clicking the "BLACKJACK" chip on the MORE screen.
function blackjackInstructions()
{
    const INSTRUCTIONS_Y = 100;

    outputInstructionPages = 
    [
        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("BLACKJACK PAGE 1", DEFAULT_CANVAS_SIZE / 2, DEFAULT_CANVAS_SIZE / 2);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("BLACKJACK PAGE 2", DEFAULT_CANVAS_SIZE / 2, DEFAULT_CANVAS_SIZE / 2);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("BLACKJACK PAGE 3", DEFAULT_CANVAS_SIZE / 2, DEFAULT_CANVAS_SIZE / 2);
        },
    ];

    // Will only create the object array once upon loading
    if (Game.counter === 0)
    {
        createInstructionsEvents();
        Game.counter++;
    }

    drawBG();

    ctx.fillStyle = 'white';
    ctx.font = "30px Arial";
    ctx.fillText("BLACKJACK INSTRUCTIONS", DEFAULT_CANVAS_SIZE / 2, INSTRUCTIONS_Y);

    outputInstructionPages[pageIndex]();

    drawInstructionsChips();
}

// Draws the chips in the instructions screens.
function drawInstructionsChips()
{
    drawMenuChip();

    drawPreviousChip();

    drawNextChip();

    function drawMenuChip()
    {
        if (canvasObjs[0].isHovered)
        {
            canvasObjs[0].hoverCallback();
        }
        else
        {
            drawChip(DEFAULT_CANVAS_SIZE / 2, (DEFAULT_CANVAS_SIZE / 8) * 7, "MENU", '#AA0000');
        }
    }

    function drawPreviousChip()
    {
        if (canvasObjs[1].isHovered)
        {
            canvasObjs[1].hoverCallback();
        }
        else
        {
            drawChip(DEFAULT_CANVAS_SIZE / 4, (DEFAULT_CANVAS_SIZE / 4) * 3, "PREVIOUS", '#AA0000');
        }
    }

    function drawNextChip()
    {
        if (canvasObjs[2].isHovered)
        {
            canvasObjs[2].hoverCallback();
        }
        else
        {
            drawChip((DEFAULT_CANVAS_SIZE / 4) * 3, (DEFAULT_CANVAS_SIZE / 4) * 3, "NEXT", '#AA0000');
        }
    }
}

// Creates the objects of instructions menu chip, defining their click and hover callback functions.
function createInstructionsEvents()
{
    menuChip();
    
    previousChip();

    nextChip();

    function menuChip()
    {
        canvasObjs[0] = new CanvasObject(DEFAULT_CANVAS_SIZE / 2, (DEFAULT_CANVAS_SIZE / 8) * 7, 0, 0, CHIP_RADIUS);
        canvasObjs[0].clickCallback = function()
        {
            Game.context = 'MoreScreen';
    
            resetArray();

            while (outputInstructionPages.length > 0)
            {
                outputInstructionPages.pop();
            }

            pageIndex = 0;
        }
        canvasObjs[0].hoverCallback = function()
        {
            drawChip(DEFAULT_CANVAS_SIZE / 2, (DEFAULT_CANVAS_SIZE / 8) * 7, "MENU", '#0000AA');
        }
    }

    function previousChip()
    {
        canvasObjs[1] = new CanvasObject(DEFAULT_CANVAS_SIZE / 4, (DEFAULT_CANVAS_SIZE / 4) * 3, 0, 0, CHIP_RADIUS);
        canvasObjs[1].clickCallback = function()
        {
            if (pageIndex > 0)
            {
                pageIndex--;
            }
        }
        canvasObjs[1].hoverCallback = function()
        {
            drawChip(DEFAULT_CANVAS_SIZE / 4, (DEFAULT_CANVAS_SIZE / 4) * 3, "PREVIOUS", '#0000AA');
        }
    }

    function nextChip()
    {
        canvasObjs[2] = new CanvasObject((DEFAULT_CANVAS_SIZE / 4) * 3, (DEFAULT_CANVAS_SIZE / 4) * 3, 0, 0, CHIP_RADIUS);
        canvasObjs[2].clickCallback = function()
        {
            if (pageIndex < outputInstructionPages.length - 1)
            {
                pageIndex++;
            }
        }
        canvasObjs[2].hoverCallback = function()
        {
            drawChip((DEFAULT_CANVAS_SIZE / 4) * 3, (DEFAULT_CANVAS_SIZE / 4) * 3, "NEXT", '#0000AA');
        }
    }
}