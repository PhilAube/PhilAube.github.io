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

            if (Game.lastTimedEvent === 0)
            {
                Game.lastTimedEvent = Game.frameCounter;
            }

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
            drawTable("BLACKJACK");
            drawEvents();
            drawUserHand();
            drawCPUHand();
            Game.counter++;
            break;

        case 8: // Player's first play
            drawTable("BLACKJACK");
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
            drawTable("BLACKJACK");
            drawEvents();
            drawUserHand();
            drawCPUHand();

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
                Game.handValue = "BLACKJACK!";
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

            ctx.fillStyle = 'white';
            ctx.fillText(Game.handValue, 100, DEFAULT_CANVAS_SIZE - 80);
            ctx.fillText("PLAY AGAIN?", 100, DEFAULT_CANVAS_SIZE - 50);

            Game.counter = 17;
            break;

        case 17:
            drawCPUHand();
            drawUserHand();
            drawEvents();

            canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawChip(250, DEFAULT_CANVAS_SIZE - 75, 'YES', '#AA0000');
            canvasObjs[2].isHovered ? canvasObjs[2].hoverCallback() : drawChip(375, DEFAULT_CANVAS_SIZE - 75, 'NO', '#AA0000');
            break;

        case 69:
            while (canvasObjs.length > 1)
            {
                canvasObjs.pop();
            }

            hideChip(20, CHIP_Y - 60);
            hideChip(145, CHIP_Y - 60);
            hideChip(270, DEFAULT_CANVAS_SIZE - 135);

            canvasObjs[1] = new CanvasObject(MID_CANVAS - 40, MID_CANVAS - 50, 80, 60);
            canvasObjs[1].clickCallback = function()
            {
                canvasObjs.pop();

                if (Game.err == 1) Game.counter = 7;
                else Game.counter = 0;

                Game.err = undefined;
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
                case 1:
                    ctx.fillText("Insufficient chips to double down.", MID_CANVAS, MID_CANVAS - 100);
                    break;

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

        case 420:
            drawBox("Are you sure?");
            ctx.fillText("You will lose your chips!", DEFAULT_CANVAS_SIZE / 2, 200);
            drawYNBox("YES", 200, 'white');
            drawYNBox("NO", 320, 'white');

            while (canvasObjs.length > 1)
            {
                canvasObjs.pop();
            }

            // Create are you sure events
            yesButton();
            noButton();

            Game.counter++;
            break;

        case 421:
            canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawYNBox("YES", 200, 'white');
            canvasObjs[2].isHovered ? canvasObjs[2].hoverCallback() : drawYNBox("NO", 320, 'white');
            drawEvents();
            break;

        function yesButton()
        {
            canvasObjs[1] = new CanvasObject(200, 250, 80, 60);
            canvasObjs[1].clickCallback = function()
            {
                Game.context = 'TitleScreen';
        
                resetArray();
    
                resetHand(Game.CPUHand);
    
                resetHand(Game.userHand);
            }
            canvasObjs[1].hoverCallback = function()
            {
                drawYNBox("YES", 200, '#AAA');
            }
        }

        function noButton()
        {
            canvasObjs[2] = new CanvasObject(320, 250, 80, 60);
            canvasObjs[2].clickCallback = function()
            {
                // Remove yes/no button events
                while (canvasObjs.length > 1)
                {
                    canvasObjs.pop();
                }

                drawTable("BLACKJACK");
                drawMenu();

                determineAction();
            }
            canvasObjs[2].hoverCallback = function()
            {
                drawYNBox("NO", 320, '#AAA');
            }
        }
    }

    // For no button, determines where to go back to.
    function determineAction()
    {
        Game.lastTimedEvent = 0;

        switch (Game.prevCounter)
        {
            // Case 0 and 1 is pointless since user hasn't placed a bet.

            case 2:
                Game.counter = 2;
                break;
            
            case 3:
            case 4:
            case 5:
            case 6:
                Game.lastTimedEvent = 0;
                drawCPUHand();
                drawUserHand();
                Game.counter = Game.prevCounter;
                break;

            case 7:
            case 8:
                Game.counter = 7;
                break;

            case 9:
            case 10:
                createBJEvents(); // Won't create Double Down
                drawCPUHand();
                drawUserHand();
                Game.counter = 10;
                break;

            case 11:
                drawMenu();
                drawCPUHand();
                drawUserHand();
                Game.counter = Game.prevCounter;
                break;

            case 12:
            case 13:
            case 14:
            case 15:
                Game.counter = Game.prevCounter;
                break;

            case 16:
            case 17:
                Game.counter = 16;
                break;

            default: 
                alert("It's not a bug, it's an easter egg.");
                break;
        }
    }

    // Creates the events for the Play Again dialog box.
    function createPlayAgainEvents()
    {
        yesButton();

        noButton();

        function yesButton()
        {
            canvasObjs[1] = new CanvasObject(250, DEFAULT_CANVAS_SIZE - 75, 0, 0, CHIP_RADIUS);
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
                drawChip(250, DEFAULT_CANVAS_SIZE - 75, 'YES', '#0000AA');
            }
        }

        function noButton()
        {
            canvasObjs[2] = new CanvasObject(375, DEFAULT_CANVAS_SIZE - 75, 0, 0, CHIP_RADIUS);
            canvasObjs[2].clickCallback = function()
            {
                Game.context = 'TitleScreen';
                resetArray();
                Game.lastTimedEvent = 0;
                resetHand(Game.CPUHand);
                resetHand(Game.userHand);
                Game.prevCounter = null;
            }
            canvasObjs[2].hoverCallback = function()
            {
                drawChip(375, DEFAULT_CANVAS_SIZE - 75, 'NO', '#0000AA');
            }
        }
    }

    // Creates the events for the Blackjack game.
    function createBJEvents()
    {
        // canvasObjs[0] (Menu button) is still there so start from 1

        hitChip();

        standChip();

        if (Game.counter < 9)
        {
            doubleDownChip();
        }

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

                canvasObjs[1].isHovered = false;
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
                    Game.counter = 69;
                    Game.err = 1;
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
            Game.lastTimedEvent = 0;
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
            let card = Game.userHand.cards[i];
            
            if (card != null)
            {
                card.drawCard(50 + (i * 50), USER_HAND_Y);
            }
        }
    }

    // Draws the CPU hand, with face down card if necessary.
    function drawCPUHand()
    {
        if (Game.counter < 11 || Game.counter == 421)
        {
            if (Game.CPUHand.cards[0] != null)
            {
                Game.CPUHand.cards[0].drawCard(50, CPU_HAND_Y);

                if (Game.CPUHand.cards[1] != null)
                {
                    drawFaceDown(100, CPU_HAND_Y, 'white');
                }
            }
        }
        else
        {
            for (let i = 0; i < Game.CPUHand.cards.length; i++)
            {
                let card = Game.CPUHand.cards[i];

                if (card != null)
                {
                    card.drawCard(50 + (i * 50), CPU_HAND_Y);
                }
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

                hideChip(20, CHIP_Y - 60);
                hideChip(145, CHIP_Y - 60);
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