// * This file contains the code for the Poker game itself. * //

function Poker()
{
    const BACK_CHIP_XY = DEFAULT_CANVAS_SIZE - 75;

    switch(Game.counter)
    {
        case 0:
            Game.lastTimedEvent = 0;
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
            drawTable("POKER");
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            Game.deck.Shuffle();
            Game.counter++;
            break;

        // Distribute 5 cards to the player: Card 1
        case 3:          
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            distributeCards(100, 150, Game.userHand, false);
            break;

        // Card 2
        case 4:          
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            distributeCards(175, 150, Game.userHand, false);
            break;

        // Card 3
        case 5:
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            distributeCards(250, 150, Game.userHand, false);
            break;

        // Card 4
        case 6:
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            distributeCards(325, 150, Game.userHand, false);
            break;

        // Card 5
        case 7:
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            distributeCards(400, 150, Game.userHand, false);
            break;

        case 8:
            createPokerEvents();
            Game.counter++;
            break;
        
        // Allow the player to make their choice
        case 9: 
            drawEvents();

            let i = 0;

            for (i = 2; i <= 6; i++)
            {
                if (canvasObjs[i].isHovered)
                {
                    canvasObjs[i].hoverCallback();
                    break;
                }
            }

            if (i > 6) drawNormalHand();
            break;
    }

    // Creates the events for the Poker game.
    function createPokerEvents()
    {
        // canvasObjs[0] (Menu button) is still there so start from 1

        canvasObjs[1] = new CanvasObject(75, DEFAULT_CANVAS_SIZE - 75, 0, 0, CHIP_RADIUS);
        canvasObjs[1].clickCallback = function()
        {
            alert("PLAY");
        }
        canvasObjs[1].hoverCallback = function()
        {
            drawChip(75, DEFAULT_CANVAS_SIZE - 75, 'PLAY', '#0000AA');
        }
        canvasObjs[2] = new CanvasObject(100, 150, 75, 150);
        canvasObjs[2].clickCallback = function()
        {
            alert("CARD 1");
        }
        canvasObjs[2].hoverCallback = function()
        {
            drawHandWithHover(0);
        }
        canvasObjs[3] = new CanvasObject(175, 150, 75, 150);
        canvasObjs[3].clickCallback = function()
        {
            alert("CARD 2");
        }
        canvasObjs[3].hoverCallback = function()
        {
            drawHandWithHover(1);
        }
        canvasObjs[4] = new CanvasObject(250, 150, 75, 150);
        canvasObjs[4].clickCallback = function()
        {
            alert("CARD 3");
        }
        canvasObjs[4].hoverCallback = function()
        {
            drawHandWithHover(2);
        }
        canvasObjs[5] = new CanvasObject(325, 150, 75, 150);
        canvasObjs[5].clickCallback = function()
        {
            alert("CARD 4");
        }
        canvasObjs[5].hoverCallback = function()
        {
            drawHandWithHover(3);
        }
        canvasObjs[6] = new CanvasObject(400, 150, 100, 150);
        canvasObjs[6].clickCallback = function()
        {
            alert("CARD 5");
        }
        canvasObjs[6].hoverCallback = function()
        {
            drawHandWithHover(4);
        }
    }

    function drawEvents()
    {
        canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
        canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawChip(75, DEFAULT_CANVAS_SIZE - 75, 'PLAY', '#AA0000');
    }

    // Distributes cards one by one.
    function distributeCards(x, y, hand, nope)
    {
        if (Game.lastTimedEvent === 0)
        {
            Game.lastTimedEvent = Game.frameCounter;
        }

        if (Game.frameCounter === Game.lastTimedEvent + 60)
        {
            hand.cards[hand.cards.length] = Game.deck.cards[Game.deck.topCard];
            Game.deck.cards[Game.deck.topCard].drawCard(x, y);
            Game.lastTimedEvent = Game.frameCounter;
            Game.deck.topCard++;

            if (!nope)
            {
                Game.counter++;
            }
        }
    }

    // Draws the Poker hand.
    function drawNormalHand()
    {
        for (let i = 0; i < 5; i++)
        {
            let x = 100 + (i * 75);
            let y = 150;
            let card = Game.userHand.cards[i];

            card.drawCard(x, y);
        }
    }

    // Specify which card in the hand is being hovered.
    function drawHandWithHover(hoverIndex)
    {
        for (let i = 0; i < 5; i++)
        {
            let x = 100 + (i * 75);
            let y = 150;
            let card = Game.userHand.cards[i];

            i == hoverIndex ? card.drawCard(x, y, true) : card.drawCard(x, y, false);
        }
    }
}