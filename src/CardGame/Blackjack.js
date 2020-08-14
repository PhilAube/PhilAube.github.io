// * This file contains the code for the actual Blackjack game itself. *//

function Blackjack()
{
    const BACK_CHIP_XY = DEFAULT_CANVAS_SIZE - 75;

    switch(Game.counter)
    {
        case 0:
            createBettingEvents(BACK_CHIP_XY);
            Game.counter++;
            break;
            
        case 1: 
            drawTable("BLACKJACK");
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            wager();
            break;

        case 2:
            deleteBettingEvents();
            Game.deck.Shuffle();
            Game.counter++;
            break;

        case 3:
            createBJEvents();
            break;
        
        case 4:
            drawTable("BLACKJACK");
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            break;

        case 69: // Are you sure you want to quit menu

            break;
    }

    // Creates the events for the Blackjack game.
    function createBJEvents()
    {
        // canvasObjs[0] (Menu button) is still there so start from 1
        
        Game.counter++;
    }
}