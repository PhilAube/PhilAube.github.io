// * This file contains the instruction menus for BlackJack and Poker. //

// This is the array of instruction pages, as well as the page tracker.
let outputInstructionPages = [];
let pageIndex = 0;

const INSTRUCTION_CHIP_Y = (DEFAULT_CANVAS_SIZE / 8) * 7;

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
            ctx.fillText("PAGE 1", DEFAULT_CANVAS_SIZE / 2, DEFAULT_CANVAS_SIZE / 2);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("PAGE 2", DEFAULT_CANVAS_SIZE / 2, DEFAULT_CANVAS_SIZE / 2);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("PAGE 3", DEFAULT_CANVAS_SIZE / 2, DEFAULT_CANVAS_SIZE / 2);
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
    const INSTRUCTIONS_Y = 50;

    const CARD_Y_1 = 75;
    const CARD_Y_2 = 300;

    let demoDeck = new Deck();

    outputInstructionPages = 
    [
        function() // Page 1 explains the card values.
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";

            drawDemoCards();

            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("Ace is worth 1 or 11.", 250, CARD_Y_2 + (CARD_HEIGHT / 3));
            ctx.fillText("Numbered cards are worth their normal value.", (DEFAULT_CANVAS_SIZE / 2), (DEFAULT_CANVAS_SIZE / 2) - 25);
            ctx.fillText("Face cards are worth 10.", 250, CARD_Y_2 + (CARD_HEIGHT / 3) * 2);

            // Draws the cards to illustrate card values.
            function drawDemoCards()
            {
                let index = 0;

                // Hand picked cards for the demo.
                const demoCards = [ 40, 2, 29, 17, 44, 6, 33, 21, 48 ];

                for (let x = 50; x <= 450; x +=50)
                {
                    demoDeck.cards[demoCards[index]].drawCard(x, CARD_Y_1);
                    index++;
                }

                demoDeck.cards[26].drawCard(50, CARD_Y_2);

                demoDeck.cards[10].drawCard(350, CARD_Y_2);
                demoDeck.cards[50].drawCard(400, CARD_Y_2);
                demoDeck.cards[25].drawCard(450, CARD_Y_2);
            }
        },

        function() // Page 2
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("The objective of the game is to beat the dealer's hand without going over 21.", DEFAULT_CANVAS_SIZE / 2, DEFAULT_CANVAS_SIZE / 2);
        },

        function() // Page 3
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("You can hit, stand, or double down if you're feeling lucky.", DEFAULT_CANVAS_SIZE / 2, DEFAULT_CANVAS_SIZE / 2);
        },
    ];

    // Will only create the object array once upon loading
    if (Game.counter === 0)
    {
        createInstructionsEvents(demoDeck);
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
            drawChip(DEFAULT_CANVAS_SIZE / 2, INSTRUCTION_CHIP_Y, "MENU", '#AA0000');
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
            drawChip(DEFAULT_CANVAS_SIZE / 4, INSTRUCTION_CHIP_Y, "PREVIOUS", '#AA0000');
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
            drawChip((DEFAULT_CANVAS_SIZE / 4) * 3, INSTRUCTION_CHIP_Y, "NEXT", '#AA0000');
        }
    }
}

// Creates the objects of instructions menu chip, defining their click and hover callback functions.
function createInstructionsEvents(demoDeck)
{
    menuChip(demoDeck);
    
    previousChip();

    nextChip();

    function menuChip(demoDeck)
    {
        canvasObjs[0] = new CanvasObject(DEFAULT_CANVAS_SIZE / 2, INSTRUCTION_CHIP_Y, 0, 0, CHIP_RADIUS);
        canvasObjs[0].clickCallback = function()
        {
            Game.context = 'MoreScreen';
    
            resetArray();

            while (outputInstructionPages.length > 0) // Removes instruction pages from memory.
            {
                outputInstructionPages.pop();
            }

            while (demoDeck.length > 0) // Removes demo deck from memory.
            {
                demoDeck.pop();
            }

            pageIndex = 0;
        }
        canvasObjs[0].hoverCallback = function()
        {
            drawChip(DEFAULT_CANVAS_SIZE / 2, INSTRUCTION_CHIP_Y, "MENU", '#0000AA');
        }
    }

    function previousChip()
    {
        canvasObjs[1] = new CanvasObject(DEFAULT_CANVAS_SIZE / 4, INSTRUCTION_CHIP_Y, 0, 0, CHIP_RADIUS);
        canvasObjs[1].clickCallback = function()
        {
            if (pageIndex > 0)
            {
                pageIndex--;
            }
        }
        canvasObjs[1].hoverCallback = function()
        {
            drawChip(DEFAULT_CANVAS_SIZE / 4, INSTRUCTION_CHIP_Y, "PREVIOUS", '#0000AA');
        }
    }

    function nextChip()
    {
        canvasObjs[2] = new CanvasObject((DEFAULT_CANVAS_SIZE / 4) * 3, INSTRUCTION_CHIP_Y, 0, 0, CHIP_RADIUS);
        canvasObjs[2].clickCallback = function()
        {
            if (pageIndex < outputInstructionPages.length - 1)
            {
                pageIndex++;
            }
        }
        canvasObjs[2].hoverCallback = function()
        {
            drawChip((DEFAULT_CANVAS_SIZE / 4) * 3, INSTRUCTION_CHIP_Y, "NEXT", '#0000AA');
        }
    }
}