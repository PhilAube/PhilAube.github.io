// * This file contains the code for the Poker game itself. * //

function Poker()
{
    const BACK_CHIP_XY = DEFAULT_CANVAS_SIZE - 75;

    switch(Game.counter)
    {
        case 0:
            createBettingEvents(BACK_CHIP_XY);
            Game.counter++;
            break;
            
        case 1: 
            drawTable("POKER");
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            wager();
            break;
        
        case 2:
            deleteBettingEvents();
            Game.deck.Shuffle();
            Game.counter++;
            break;

        case 3:          
            createPokerEvents();
            Game.counter++;
            break;

        case 4:
            drawTable("POKER");
            drawEvents();
            break;

        case 69: // Are you sure you want to quit menu

            break;
    }

    // Creates the events for the Poker game.
    function createPokerEvents()
    {
        // canvasObjs[0] (Menu button) is still there so start from 1

        canvasObjs[1] = new CanvasObject(75, DEFAULT_CANVAS_SIZE - 75, 0, 0, CHIP_RADIUS);
        canvasObjs[1].clickCallback = function()
        {
            alert("DISCARD");
        }
        canvasObjs[1].hoverCallback = function()
        {
            drawChip(75, DEFAULT_CANVAS_SIZE - 75, 'DISCARD', '#0000AA');
        }
        canvasObjs[2] = new CanvasObject(200, DEFAULT_CANVAS_SIZE - 75, 0, 0, CHIP_RADIUS);
        canvasObjs[2].clickCallback = function()
        {
            alert("PLAY");
        }
        canvasObjs[2].hoverCallback = function()
        {
            drawChip(200, DEFAULT_CANVAS_SIZE - 75, 'PLAY', '#0000AA');
        }
    }

    function drawEvents()
    {
        canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
        canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawChip(75, DEFAULT_CANVAS_SIZE - 75, 'DISCARD', '#AA0000');
        canvasObjs[2].isHovered ? canvasObjs[2].hoverCallback() : drawChip(200, DEFAULT_CANVAS_SIZE - 75, 'PLAY', '#AA0000');
    }
}