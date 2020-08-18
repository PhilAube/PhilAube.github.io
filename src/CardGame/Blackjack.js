// * This file contains the code for the actual Blackjack game itself. *//

function Blackjack()
{
    const BACK_CHIP_XY = DEFAULT_CANVAS_SIZE - 75;

    switch(Game.counter)
    {
        case 0: // Add Betting events, make sure everything is reset
            createBettingEvents(BACK_CHIP_XY);
            Game.counter++;
            Game.deck.topCard = 0;
            Game.lastTimedEvent = 0;
            break;
            
        case 1: // Draw betting window and table, shuffles while user bets
            drawTable("BLACKJACK");
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            wager();
            Game.deck.Shuffle();
            break;

        case 2: // Delete betting events
            deleteBettingEvents();
            Game.counter++;
            break;

        case 3: // Begin distributing cards, CPU card
            drawTable("BLACKJACK");
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            distributeCards(50, 75, Game.CPUHand, false);
            break;
        
        case 4: // User's first card
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            distributeCards(50, 275, Game.userHand, false);
            break;

        case 5: // Facedown CPU card
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();

            if (Game.frameCounter === Game.lastTimedEvent + 60)
            {
                Game.CPUHand.cards[1] = Game.deck.cards[Game.deck.topCard];
                drawFaceDown(100, 75, 'white');
                Game.lastTimedEvent = Game.frameCounter;
                Game.deck.topCard++;
                Game.counter++;
            }
            break;

        case 6: // User's second card
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            distributeCards(100, 275, Game.userHand, false);
            break;

        case 7: // Create events for user Blackjack options
            Game.lastTimedEvent = 0;
            createBJEvents();
            Game.counter++;
            break;

        case 8: // Player's first play
            drawEvents();
            drawUserHand();
            drawCPUHand();

            checkHandValue(Game.userHand, true);
            break;
        
        case 9: // After user draws one card
            canvasObjs.pop(); // Delete double down event
            hideChip(270, DEFAULT_CANVAS_SIZE - 135);
            Game.counter++;
            break;

        case 10: // If the user wants to draw more than one card
            drawCPUHand();
            drawUserHand();
            drawEvents();

            checkHandValue(Game.userHand, true);
            break;

        case 11: // When the user stands
            while (canvasObjs.length > 1)
            {
                canvasObjs.pop();
            }

            drawTable("BLACKJACK");
            drawCPUHand();
            drawUserHand();

            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();

            checkHandValue(Game.userHand, true);

            Game.counter++;
            Game.lastTimedEvent = 0;

            break;

        case 12: // Dealer's play
            drawCPUHand();
            drawUserHand();
            drawEvents();

            checkHandValue(Game.CPUHand, false);

            if (Game.handValue < 17)
            {
                checkHandValue(Game.userHand, true);
                let myHand = Game.handValue;
                checkHandValue(Game.CPUHand, false);
                let pcHand = Game.handValue;

                if (pcHand > myHand) // A smart dealer won't draw cards till 17 if they already beat the player.
                {
                    Game.counter++;
                }
                else
                {
                    distributeCards(50 + (Game.CPUHand.cards.length * 50), 75, Game.CPUHand, true);
                }
            }
            else
            {
                Game.counter++;
            }

            break;

        case 13: // Check win / loss after dealer's turn
            checkHandValue(Game.userHand, true);
            let myHand = Game.handValue;
            checkHandValue(Game.CPUHand, false);
            let pcHand = Game.handValue;

            if (myHand === pcHand)
            {
                alert("STANDOFF");
                
                Game.bank += Game.bet;
                localStorage.setItem('bank', Game.bank);

                Game.counter = 16;
            }
            else if (myHand > pcHand)
            {
                myHand <= 21 ? Game.counter = 15 : Game.counter = 14;
            }
            else if (myHand < pcHand)
            {
                pcHand > 21 ? Game.counter = 15 : Game.counter = 14;
            }
            break;

        case 14: // You lose
            alert("YOU LOSE");
            Game.counter = 16;
            break;

        case 15: // You win
            checkHandValue(Game.userHand, true);
            if (Game.userHand.cards.length === 2 & Game.handValue === 21) // If they got a Blackjack
            {
                alert("YOU WIN WITH BLACKJACK");
                Game.bank += Game.bet * 3;
                localStorage.setItem('bank', Game.bank);
                Game.counter = 16;
            }
            else if (Game.handValue <= 21) // Verify the hand isn't over 21.
            {
                alert("YOU WIN");
                Game.bank += Game.bet * 2;
                localStorage.setItem('bank', Game.bank);
                Game.counter = 16;
            }
            else 
            {
                Game.counter = 14;
            }


            break;

        case 16: // Play again
            drawTable("BLACKJACK");
            drawEvents();
            drawCPUHand();
            drawUserHand();
            // alert("Play again?");
            Game.counter++;
            break;

        case 17:
            drawCPUHand();
            drawUserHand();
            drawEvents();
            break;

        case 69: // Are you sure you want to quit menu

            break;
    }

    // Creates the events for the Blackjack game.
    function createBJEvents()
    {
        // canvasObjs[0] (Menu button) is still there so start from 1

        canvasObjs[1] = new CanvasObject(75, DEFAULT_CANVAS_SIZE - 75, 0, 0, CHIP_RADIUS);
        canvasObjs[1].clickCallback = function() // HIT
        {
            Game.userHand.cards[Game.userHand.cards.length] = Game.deck.cards[Game.deck.topCard];
            Game.deck.topCard++;
            Game.userHand.cards[Game.userHand.cards.length - 1].drawCard(50 + ((Game.userHand.cards.length - 1) * 50), 275);

            if (Game.counter === 8) // If it's the user's third card
            {
                Game.counter++;
            }
        }
        canvasObjs[1].hoverCallback = function()
        {
            drawChip(75, DEFAULT_CANVAS_SIZE - 75, 'HIT', '#0000AA');
        }
        canvasObjs[2] = new CanvasObject(200, DEFAULT_CANVAS_SIZE - 75, 0, 0, CHIP_RADIUS);
        canvasObjs[2].clickCallback = function() // STAND
        {
            if (Game.counter === 8)
            {
                canvasObjs.pop(); // Remove double down
            }

            Game.counter = 11;
        }
        canvasObjs[2].hoverCallback = function()
        {
            drawChip(200, DEFAULT_CANVAS_SIZE - 75, 'STAND', '#0000AA');
        }
        canvasObjs[3] = new CanvasObject(325, DEFAULT_CANVAS_SIZE - 75, 0, 0, CHIP_RADIUS);
        canvasObjs[3].clickCallback = function() // DOUBLE DOWN
        {
            if (Game.bank - Game.bet >= 0) // If the user has enough chips
            {
                Game.bank -= Game.bet;
                localStorage.setItem('bank', Game.bank);

                Game.bet *= 2;   
                Game.counter = 11;

                Game.userHand.cards[Game.userHand.cards.length] = Game.deck.cards[Game.deck.topCard];
                Game.deck.topCard++;
            }
            else
            {
                alert("You don't have enough chips to double down.");
            }
        }
        canvasObjs[3].hoverCallback = function()
        {
            drawChip(325, DEFAULT_CANVAS_SIZE - 75, 'DOUBLE DOWN', '#0000AA');
        }
    }

    // The options the user can choose.
    function drawEvents()
    {
        canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();

        if (Game.counter < 12)
        {
            canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawChip(75, DEFAULT_CANVAS_SIZE - 75, 'HIT', '#AA0000');
            canvasObjs[2].isHovered ? canvasObjs[2].hoverCallback() : drawChip(200, DEFAULT_CANVAS_SIZE - 75, 'STAND', '#AA0000');
    
            if (Game.userHand.cards.length <= 2)
            {
                canvasObjs[3].isHovered ? canvasObjs[3].hoverCallback() : drawChip(325, DEFAULT_CANVAS_SIZE - 75, 'DOUBLE DOWN', '#AA0000');
            }
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

    // Draws the user's hand.
    function drawUserHand()
    {
        for (let i = 0; i < Game.userHand.cards.length; i++)
        {
            Game.userHand.cards[i].drawCard(50 + (i * 50), 275);
        }
    }

    // Draws the CPU hand, with face down card if necessary.
    function drawCPUHand()
    {
        if (Game.counter < 11)
        {
            Game.CPUHand.cards[0].drawCard(50, 75);
            drawFaceDown(100, 75, 'white');
        }
        else
        {
            for (let i = 0; i < Game.CPUHand.cards.length; i++)
            {
                Game.CPUHand.cards[i].drawCard(50 + (i * 50), 75);
            }
        }
    }

    // Determines what the value of a hand is.
    function checkHandValue(hand, user)
    {
        Game.handValue = hand.getBJValue();

        if (user)
        {
            if (Game.handValue > 21)
            {
                Game.counter = 14;
                while (canvasObjs.length > 1)
                {
                    canvasObjs.pop();
                }
            }
            else if (Game.handValue === 21)
            {
                Game.counter = 12;
                while (canvasObjs.length > 1)
                {
                    canvasObjs.pop();
                }
            }
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