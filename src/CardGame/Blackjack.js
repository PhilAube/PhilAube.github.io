// * This file contains the code for the actual Blackjack game itself. *//

function Blackjack()
{
    const CHIP_Y = DEFAULT_CANVAS_SIZE - 75;
    const CPU_HAND_Y = 50;
    const USER_HAND_Y = 250;

    switch(Game.counter)
    {
        case 0: // Add Betting events, make sure everything is reset
            createBettingEvents();
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
            distributeCards(50, CPU_HAND_Y, Game.CPUHand, false);
            break;
        
        case 4: // User's first card
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            distributeCards(50, USER_HAND_Y, Game.userHand, false);
            break;

        case 5: // Facedown CPU card
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();

            if (Game.frameCounter === Game.lastTimedEvent + 60)
            {
                Game.CPUHand.cards[1] = Game.deck.cards[Game.deck.topCard];
                drawFaceDown(100, CPU_HAND_Y, 'white');
                Game.lastTimedEvent = Game.frameCounter;
                Game.deck.topCard++;
                Game.counter++;
            }
            break;

        case 6: // User's second card
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            distributeCards(100, USER_HAND_Y, Game.userHand, false);
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
            deleteChipEvents();

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
                    distributeCards(50 + (Game.CPUHand.cards.length * 50), CPU_HAND_Y, Game.CPUHand, true);
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
                Game.handValue = "STANDOFF!";
                
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
            Game.handValue = "YOU LOSE!";
            Game.counter = 16;
            break;

        case 15: // You win
            checkHandValue(Game.userHand, true);
            if (Game.userHand.cards.length === 2 & Game.handValue === 21) // If they got a Blackjack
            {
                Game.handValue = "YOU WIN WITH BLACKJACK!";
                Game.bank += Game.bet * 3;
                localStorage.setItem('bank', Game.bank);
                Game.counter = 16;
            }
            else if (Game.handValue <= 21) // Verify the hand isn't over 21.
            {
                Game.handValue = "YOU WIN!";
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
            deleteChipEvents();
            createPlayAgainEvents();
            Game.counter = 17;
            break;

        case 17:
            drawCPUHand();
            drawUserHand();
            drawEvents();
            drawBox(Game.handValue);
            ctx.fillText("PLAY AGAIN?", MID_CANVAS, 200);

            canvasObjs[1].isHovered ? drawYNBox("YES", 200, '#CCC') : drawYNBox("YES", 200, 'white');
            canvasObjs[2].isHovered ? drawYNBox("NO", 320, '#CCC') : drawYNBox("NO", 320, 'white');
            break;
    }

    // Draws the Yes or No box for the event.
    function drawYNBox(YN, x, color)
    {
        ctx.beginPath();
        ctx.rect(x, 250, 80, 80);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.fillText(YN, x + 40, 300);
    }

    // Creates the events for the Play Again dialog box.
    function createPlayAgainEvents()
    {
        yesButton();

        noButton();

        function yesButton()
        {
            canvasObjs[1] = new CanvasObject(200, 250, 80, 80);
            canvasObjs[1].clickCallback = function()
            {
                Game.counter = 0;
                resetArray();
                Game.lastTimedEvent = 0;
                resetHand(Game.CPUHand);
                resetHand(Game.userHand);
            }
            canvasObjs[1].hoverCallback = function()
            {
                ctx.beginPath();
                ctx.rect(200, 250, 80, 80);
                ctx.fillStyle = '#CCC';
                ctx.fill();
        
                ctx.fillStyle = 'black';
                ctx.fillText("YES", 240, 300);
            }
        }

        function noButton()
        {
            canvasObjs[2] = new CanvasObject(320, 250, 80, 80);
            canvasObjs[2].clickCallback = function()
            {
                Game.context = 'TitleScreen';
                resetArray();
                Game.lastTimedEvent = 0;
                resetHand(Game.CPUHand);
                resetHand(Game.userHand);
            }
            canvasObjs[2].hoverCallback = function()
            {
                ctx.beginPath();
                ctx.rect(320, 250, 80, 80);
                ctx.fillStyle = '#CCC';
                ctx.fill();
        
                ctx.fillStyle = 'black';
                ctx.fillText("NO", 360, 300);
            }
        }
    }

    // Creates the events for the Blackjack game.
    function createBJEvents()
    {
        // canvasObjs[0] (Menu button) is still there so start from 1

        hitChip();

        standChip();

        doubleDownChip();

        function hitChip()
        {
            canvasObjs[1] = new CanvasObject(75, CHIP_Y, 0, 0, CHIP_RADIUS);
            canvasObjs[1].clickCallback = function() // HIT
            {
                Game.userHand.cards[Game.userHand.cards.length] = Game.deck.cards[Game.deck.topCard];
                Game.deck.topCard++;
                Game.userHand.cards[Game.userHand.cards.length - 1].drawCard(50 + ((Game.userHand.cards.length - 1) * 50), USER_HAND_Y);
    
                if (Game.counter === 8) // If it's the user's third card
                {
                    Game.counter++;
                }
            }
            canvasObjs[1].hoverCallback = function()
            {
                drawChip(75, CHIP_Y, 'HIT', '#0000AA');
            }
        }

        function standChip()
        {
            canvasObjs[2] = new CanvasObject(200, CHIP_Y, 0, 0, CHIP_RADIUS);
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
                drawChip(200, CHIP_Y, 'STAND', '#0000AA');
            }
        }

        function doubleDownChip()
        {
            canvasObjs[3] = new CanvasObject(325, CHIP_Y, 0, 0, CHIP_RADIUS);
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
                drawChip(325, CHIP_Y, 'DOUBLE DOWN', '#0000AA');
            }
        }
    }

    // The options the user can choose.
    function drawEvents()
    {
        canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();

        if (Game.counter < 12)
        {
            canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawChip(75, CHIP_Y, 'HIT', '#AA0000');
            canvasObjs[2].isHovered ? canvasObjs[2].hoverCallback() : drawChip(200, CHIP_Y, 'STAND', '#AA0000');
    
            if (Game.userHand.cards.length <= 2)
            {
                canvasObjs[3].isHovered ? canvasObjs[3].hoverCallback() : drawChip(325, CHIP_Y, 'DOUBLE DOWN', '#AA0000');
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
            Game.userHand.cards[i].drawCard(50 + (i * 50), USER_HAND_Y);
        }
    }

    // Draws the CPU hand, with face down card if necessary.
    function drawCPUHand()
    {
        if (Game.counter < 11)
        {
            Game.CPUHand.cards[0].drawCard(50, CPU_HAND_Y);
            drawFaceDown(100, CPU_HAND_Y, 'white');
        }
        else
        {
            for (let i = 0; i < Game.CPUHand.cards.length; i++)
            {
                Game.CPUHand.cards[i].drawCard(50 + (i * 50), CPU_HAND_Y);
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
                deleteChipEvents();
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

    // Deletes all events except 0, which is for the menu.
    function deleteChipEvents()
    {
        while (canvasObjs.length > 1)
        {
            canvasObjs.pop();
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