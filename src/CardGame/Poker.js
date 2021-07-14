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
            
        case 1: // Draw betting window and table, shuffles while user bets
            drawTable("POKER");
            canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
            wager();
            Game.deck.Shuffle();
            break;
        
        case 2:
            deleteBettingEvents();
            Game.counter++;
            break;

        // Distribute 5 cards to the player: Card 1
        case 3:          
            drawTable("POKER");
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
            drawEvents();
            drawNormalHand();
            ctx.fillStyle = 'white';
            ctx.fillText("YOU MAY NOW DISCARD UP TO 4 CARDS", DEFAULT_CANVAS_SIZE / 2, 375);
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

            drawNormalHand();
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
                    Game.userHand.cards[i].selected = true;
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
            let multiplier = determinePokerPayout();
            Game.handValue = multiplier;
            Game.bank += Game.bet * multiplier;
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

                drawTable("POKER");
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
            case 7:
                Game.lastTimedEvent = 0;
                drawNormalHand(false);
                Game.counter = Game.prevCounter;
                break;
            
            case 8:
            case 9:
                Game.counter = 8;
                break;
                
            case 10:
            case 11:
                Game.counter = Game.prevCounter;
                break;

            case 12:
                Game.counter = 12;
                drawNormalHand(true);
                break;

            case 13:
            case 14:
            case 15:
                Game.counter = Game.prevCounter;
                break;

            default: 
                alert("It's not a bug, it's an easter egg.");
                break;
        }
    }

    function showPlayAgain()
    {
        drawTable("POKER");
        canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();
        drawNormalHand();

        ctx.fillStyle = 'white';

        let string;

        switch (Game.handValue)
        {
            case 250:
                string = "ROYAL FLUSH: 250X";
                break;
            case 50:
                string = "STRAIGHT FLUSH: 50X";
                break;
            case 25:
                string = "FOUR OF A KIND: 25X";
                break;
            case 9:
                string = "FULL HOUSE: 9X";
                break;
            case 6:
                string = "FLUSH: 6X";
                break;
            case 4:
                string = "STRAIGHT: 4X";
                break;
            case 3:
                string = "THREE OF A KIND: 3X";
                break;
            case 2:
                string = "TWO PAIR: 2X";
                break;
            case 1:
                string = "PAIR: 1X";
                break;
            case 0:
                string = "YOU LOST!";
                break;
            default:
                string = "It's not a bug, it's an easter egg!";
                break;
        }

        ctx.fillText(string, DEFAULT_CANVAS_SIZE / 2, 375);
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
            resetHand(Game.CPUHand);
            Game.deck.cards.forEach(card => { card.selected = false; });
            Game.lastTimedEvent = 0;
            Game.prevCounter = null;
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

        // PLAY chip
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

            if (Game.RGBTitleScreen.mobile) canvasObjs[2].isHovered = false;
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

            if (Game.RGBTitleScreen.mobile) canvasObjs[3].isHovered = false;
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

            if (Game.RGBTitleScreen.mobile) canvasObjs[4].isHovered = false;
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

            if (Game.RGBTitleScreen.mobile) canvasObjs[5].isHovered = false;
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

            if (Game.RGBTitleScreen.mobile) canvasObjs[6].isHovered = false;
        }
        canvasObjs[6].hoverCallback = function()
        {
            drawHandWithHover(4);
        }
    }

    function drawEvents()
    {
        canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawMenu();

        if (Game.counter !== 421)
        {
            if (Game.handValue > 0)
            {
                canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawChip(75, DEFAULT_CANVAS_SIZE - 75, 'DISCARD', '#AA0000');
            }
            else
            {
                canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawChip(75, DEFAULT_CANVAS_SIZE - 75, 'PLAY', '#AA0000');
            }
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
            for (let i = 0; i < Game.userHand.cards.length; i++)
            {
                Game.userHand.cards[i].selected = false;
            }

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
                // Will not draw selected cards (to be discarded)
                if (!card.selected)
                {
                    if (card != null) card.drawCard(x, y);
                }
            }
            else if (card != null) card.drawCard(x, y);
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

    function determinePokerPayout()
    {
        Game.CPUHand.cards = Array.from(Game.userHand.cards);
        
        Game.CPUHand.cards = sortHand(Game.CPUHand.cards);

        let hand = Game.CPUHand.cards;

        // Default: 0 chips because loss
        let result = 0;

        // Rule out the special case before checking the rest.
        // ROYAL FLUSH 10 J Q K A where A is greater K

        result = checkRoyalOrStraightFlush(hand);

        if (detectSequence(hand))
        {
            // Any 5 card sequence is a STRAIGHT.
            if (result < 4) result = 4;

            if (detectSameSuit(hand))
            {
                // 5 card sequence all in same suit is STRAIGHT FLUSH
                if (result < 50) return 50;
            }
        }
        else
        {
            let tmp = detectCopies(hand);

            if (tmp > result) result = tmp;

            tmp = detectSameSuit(hand);

            if (tmp && result < 6)
            {
                result = 6;
            }
        }

        return result;
    }

    // INSERTION SORT
    function sortHand(hand)
    {
        let ranks = [ "A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K" ];

        for (let i = 1; i < hand.length; i++)
        {
            for (j = i; j > 0; j--)
            {
                let currentCard = hand[j];
                let currentCardValue = ranks.indexOf(currentCard.rank);
    
                let prevCard = hand[j - 1];
                let prevCardValue = ranks.indexOf(prevCard.rank);
    
                if (prevCardValue > currentCardValue)
                {
                    // SWAP
                    let tmp = hand[j];
                    hand[j] = hand[j - 1];
                    hand[j - 1] = tmp;
                }
            }
        }

        return hand;
    }

    // Returns true if all 5 cards are in sequence, example 8 9 10 J Q
    function detectSequence(hand)
    {
        let ranks = [ "A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K" ];

        const firstVal = ranks.indexOf(hand[0].rank);

        for (let i = 1; i < hand.length; i++)
        {
            let currentVal = ranks.indexOf(hand[i].rank);

            if (currentVal !== firstVal + i)
            {
                return false;
            }
        }

        return true;
    }

    // Detects royal or straight flush.
    function checkRoyalOrStraightFlush(hand)
    {
        if (hand[0].rank === "A")
        {
            if (hand[1].rank === 10)
            {
                if (hand[2].rank === "J")
                {
                    if (hand[3].rank === "Q")
                    {
                        if (hand[4].rank === "K")
                        {
                            const suit = hand[0].suit;

                            // If all same suit, it's royal flush, else STRAIGHT
                            if (detectSameSuit(hand))
                            {
                                return 250;
                            }
                            else return 4;
                        }
                    }
                }
            }
        }
        else if (hand[0].rank === "A")
        {
            if (hand[1].rank === 2)
            {
                if (hand[2].rank === 3)
                {
                    if (hand[3].rank === 4)
                    {
                        if (hand[4].rank === 5)
                        {
                            const suit = hand[0].suit;

                            // If all same suit, it's royal flush, else STRAIGHT
                            if (detectSameSuit(hand))
                            {
                                return 250;
                            }
                            else return 4;
                        }
                    }
                }
            }
        }

        return 0;
    }

    // Returns true if all cards are in the same suit.
    function detectSameSuit(hand)
    {
        const suit = hand[0].suit;

        for (let i = 1; i < hand.length; i++)
        {
            if (hand[i].suit !== suit)
            {
                return false;
            }
        }

        return true;
    }

    function detectCopies(hand)
    {
        let payout = 0;

        for (let i = 1; i < hand.length; i++)
        {
            if (hand[i].rank === hand[i - 1].rank) // PAIR
            {
                if (payout < 1) payout = 1;

                // CHECK FOR TWO PAIR 
                if (i + 2 < hand.length)
                {
                    if (hand[i + 1].rank === hand[i + 2].rank)
                    {
                        if (payout < 2) payout = 2;
    
                        if (i + 3 < hand.length)
                        {
                            // CHECK FOR FULL HOUSE (Is this second pair actually a trio?)
                            if (hand[i + 2].rank === hand[i + 3].rank)
                            {
                                if (payout < 9) return 9;
                            }
                        }
                    }
                    else if (i + 3 < hand.length)
                    {
                        if (hand[i + 2].rank === hand[i + 3].rank)
                        {
                            if (payout < 2) payout = 2;
                        }
                    }
                }

                if (i + 1 < hand.length)
                {
                    if (hand[i].rank === hand[i + 1].rank) // THREE OF A KIND
                    {
                        if (payout < 3) payout = 3;
    
                        if (i + 2 < hand.length)
                        {
                            // CHECK FOR FULL HOUSE (Pair with this 3 of a kind?)
                            if (hand[i + 1].rank === hand[i + 2].rank)
                            {
                                if (payout < 9) payout = 9;
                            }
                            if (hand[i + 1].rank === hand[i + 2].rank) // FOUR OF A KIND
                            {
                                if (payout < 25) return 25;
                            }
                        }
                    }
                }
            }
        }

        return payout;
    }
}