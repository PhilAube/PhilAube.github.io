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
            break;

        case 4:
            drawTable("POKER");
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            break;

        case 69: // Are you sure you want to quit menu

            break;
    }

    // Creates the events for the Poker game.
    function createPokerEvents()
    {
        // canvasObjs[0] (Menu button) is still there so start from 1

        Game.counter++;
    }
}