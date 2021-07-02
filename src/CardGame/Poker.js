// * This file contains the code for the Poker game itself. * //

function Poker()
{
    const BACK_CHIP_XY = DEFAULT_CANVAS_SIZE - 75;

    switch(Game.counter)
    {
        case 0:
            Game.lastTimedEvent = 0;
            Game.handValue = 0;
            Game.deck.topCard = 0;
            Game.deck.cards.forEach(card => { card.selected = false; })
            resetHand(Game.userHand);
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
            Game.lastTimedEvent = 0;
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

        case 10:
            // Remove the play / discard chip and disable clicking of cards
            while (canvasObjs.length > 1)
            {
                canvasObjs.pop();
            }
            hideChip(20, DEFAULT_CANVAS_SIZE - 140);

            if (Game.handValue > 0)
            {
                // User wants to discard so go to case 11
                Game.counter++;
            }
            else
            {
                Game.counter = 13;
            }

            break;

        // Remove cards if the user wants to discard
        case 11:
            drawTable("POKER");
            drawNormalHand(true);

            // Remove the actual cards and replace them with a new one
            for (let i = 0; i < Game.userHand.cards.length; i++)
            {
                if (Game.userHand.cards[i].selected)
                {
                    Game.userHand.cards[i] = Game.deck.cards[Game.deck.topCard];
                    Game.deck.topCard++;
                }
            }

            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            Game.counter++;
            break;

        // Add new cards to user hand
        case 12:
            distributeNewCards();
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            break;

        // Determine payout
        case 13:
            // Temporary: Give the user their chips back.
            Game.bank += Game.bet;
            localStorage.setItem('bank', Game.bank);
            Game.counter++;
            break;
        
        // Display result and ask to play again
        case 14:
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            createPlayAgainEvents();
            Game.counter++;
            break;

        case 15:
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            showPlayAgain();
            break;

        case 69:
            while (canvasObjs.length > 1)
            {
                canvasObjs.pop();
            }

            canvasObjs[1] = new CanvasObject(MID_CANVAS - 40, MID_CANVAS - 50, 80, 60);
            canvasObjs[1].clickCallback = function()
            {
                canvasObjs.pop();
                Game.err = undefined;
                Game.counter = 0;                
            }
            canvasObjs[1].hoverCallback = function()
            {
                drawYNBox("OK", MID_CANVAS - 40, '#FFF');
            }

            Game.counter++;
            break;
    
        case 70:
            drawBox("");
            ctx.font = '15px Arial';

            switch (Game.err)
            {
                case 2:
                    ctx.fillText("You can't play without betting chips!", MID_CANVAS, MID_CANVAS - 130);
                    ctx.fillText("You can beg for more in the SETTINGS.", MID_CANVAS, MID_CANVAS - 90);
                    break;

                case 3:
                    ctx.fillText("You can't play without betting!", MID_CANVAS, MID_CANVAS - 100);
                    break;

                case 4:
                    ctx.fillText("You can't bet more chips than you have!", MID_CANVAS, MID_CANVAS - 100);
                    break;
            }
            
            canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawYNBox("OK", MID_CANVAS - 40, '#CCC');
            break;
    }

    function showPlayAgain()
    {
        drawTable("POKER");
        canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
        drawNormalHand();

        ctx.fillStyle = 'white';
        ctx.fillText("The poker payout is still in development!", DEFAULT_CANVAS_SIZE / 2, 350);
        ctx.fillText("In the meantime, you can have your chips back.", DEFAULT_CANVAS_SIZE / 2, 400);
        ctx.fillText("PLAY AGAIN?", 100, DEFAULT_CANVAS_SIZE - 65);
        
        canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawChip(250, DEFAULT_CANVAS_SIZE - 75, 'YES', '#AA0000');
        canvasObjs[2].isHovered ? canvasObjs[2].hoverCallback() : drawChip(375, DEFAULT_CANVAS_SIZE - 75, 'NO', '#AA0000');
    }

    function createPlayAgainEvents()
    {
        // canvasObjs[0] already in use

        // Yes chip
        canvasObjs[1] = new CanvasObject(250, DEFAULT_CANVAS_SIZE - 75, 0, 0, CHIP_RADIUS);
        canvasObjs[1].clickCallback = function()
        {
            Game.counter = 0;
        }
        canvasObjs[1].hoverCallback = function()
        {
            drawChip(250, DEFAULT_CANVAS_SIZE - 75, 'YES', '#0000AA');
        }

        // No chip
        canvasObjs[2] = new CanvasObject(375, DEFAULT_CANVAS_SIZE - 75, 0, 0, CHIP_RADIUS);
        canvasObjs[2].clickCallback = function()
        {
            Game.context = 'TitleScreen';
            resetArray();
            resetHand(Game.userHand);
            Game.deck.cards.forEach(card => { card.selected = false; });
            Game.lastTimedEvent = 0;
        }
        canvasObjs[2].hoverCallback = function()
        {
            drawChip(375, DEFAULT_CANVAS_SIZE - 75, 'NO', '#0000AA');
        }
    }

    // Creates the events for the Poker game.
    function createPokerEvents()
    {
        // canvasObjs[0] (Menu button) is still there so start from 1

        canvasObjs[1] = new CanvasObject(75, DEFAULT_CANVAS_SIZE - 75, 0, 0, CHIP_RADIUS);
        canvasObjs[1].clickCallback = function()
        {
            Game.counter++;
        }
        canvasObjs[1].hoverCallback = function()
        {
            if (Game.handValue > 0)
            {
                drawChip(75, DEFAULT_CANVAS_SIZE - 75, 'DISCARD', '#0000AA');
            }
            else
            {
                drawChip(75, DEFAULT_CANVAS_SIZE - 75, 'PLAY', '#0000AA');
            }
        }
        canvasObjs[2] = new CanvasObject(100, 150, 75, 150);
        canvasObjs[2].clickCallback = function()
        {
            let card = Game.userHand.cards[0];
            if (card.selected)
            {
                Game.handValue--;
                card.selected = false;
            } 
            else if (Game.handValue < 4)
            {
                Game.handValue++;
                card.selected = true;
            }
        }
        canvasObjs[2].hoverCallback = function()
        {
            drawHandWithHover(0);
        }
        canvasObjs[3] = new CanvasObject(175, 150, 75, 150);
        canvasObjs[3].clickCallback = function()
        {
            let card = Game.userHand.cards[1];
            if (card.selected)
            {
                Game.handValue--;
                card.selected = false;
            } 
            else if (Game.handValue < 4)
            {
                Game.handValue++;
                card.selected = true;
            }
        }
        canvasObjs[3].hoverCallback = function()
        {
            drawHandWithHover(1);
        }
        canvasObjs[4] = new CanvasObject(250, 150, 75, 150);
        canvasObjs[4].clickCallback = function()
        {
            let card = Game.userHand.cards[2];
            if (card.selected)
            {
                Game.handValue--;
                card.selected = false;
            } 
            else if (Game.handValue < 4)
            {
                Game.handValue++;
                card.selected = true;
            }
        }
        canvasObjs[4].hoverCallback = function()
        {
            drawHandWithHover(2);
        }
        canvasObjs[5] = new CanvasObject(325, 150, 75, 150);
        canvasObjs[5].clickCallback = function()
        {
            let card = Game.userHand.cards[3];
            if (card.selected)
            {
                Game.handValue--;
                card.selected = false;
            } 
            else if (Game.handValue < 4)
            {
                Game.handValue++;
                card.selected = true;
            }
        }
        canvasObjs[5].hoverCallback = function()
        {
            drawHandWithHover(3);
        }
        canvasObjs[6] = new CanvasObject(400, 150, 100, 150);
        canvasObjs[6].clickCallback = function()
        {
            let card = Game.userHand.cards[4];
            if (card.selected)
            {
                Game.handValue--;
                card.selected = false;
            } 
            else if (Game.handValue < 4)
            {
                Game.handValue++;
                card.selected = true;
            }
        }
        canvasObjs[6].hoverCallback = function()
        {
            drawHandWithHover(4);
        }
    }

    function drawEvents()
    {
        canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();

        if (Game.handValue > 0)
        {
            canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawChip(75, DEFAULT_CANVAS_SIZE - 75, 'DISCARD', '#AA0000');
        }
        else
        {
            canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawChip(75, DEFAULT_CANVAS_SIZE - 75, 'PLAY', '#AA0000');
        }

    }

    // Distributes new cards all at once for discard.
    function distributeNewCards()
    {
        if (Game.lastTimedEvent === 0)
        {
            Game.lastTimedEvent = Game.frameCounter;
        }

        if (Game.frameCounter === Game.lastTimedEvent + 60)
        {
            drawNormalHand();
            Game.counter++;
        }
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
    function drawNormalHand(discard)
    {
        for (let i = 0; i < 5; i++)
        {
            let x = 100 + (i * 75);
            let y = 150;
            let card = Game.userHand.cards[i];

            if (discard)
            {
                if (!card.selected)
                {
                    card.drawCard(x, y);
                }
            }
            else card.drawCard(x, y);
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

    // Hides a chip on the bottom of the screen.
    function hideChip(x, y)
    {
        ctx.beginPath();
        ctx.fillStyle = '#333'
        ctx.rect(x, y, 110, 130);
        ctx.fill();
    }
}