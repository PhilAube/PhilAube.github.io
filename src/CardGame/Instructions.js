// * This file contains the instruction menus for BlackJack and Poker. //

// This is the array of instruction pages, as well as the page tracker.
let outputInstructionPages = [];
let pageIndex = 0;

const INSTRUCTION_CHIP_Y = (DEFAULT_CANVAS_SIZE / 8) * 7;

// Upon clicking the "POKER" chip on the MORE screen.
function pokerInstructions()
{
    const INSTRUCTIONS_Y = 100;

    // This array defines the functions to call depending on which instruction page you're on.
    outputInstructionPages = 
    [
        function() // Page 1 explains all the rules, while the rest explains the winning hands.
        {
            ctx.fillStyle = 'white';
            ctx.font = "25px Arial";
            ctx.fillText("THE OBJECTIVE", MID_CANVAS, MID_CANVAS - 140);

            ctx.font = "15px Arial";
            ctx.fillText("The point of this game is to get one of the winning hand combinations.", MID_CANVAS, MID_CANVAS - 100);
            ctx.fillText("The details about all the winning hands and their payouts start on the next page.", MID_CANVAS, MID_CANVAS - 80);

            ctx.font = "25px Arial";
            ctx.fillText("THE PLAY", MID_CANVAS, MID_CANVAS - 20);

            ctx.font = "15px Arial";
            ctx.fillText("Once you place your bet, you're given a 5-card hand.", MID_CANVAS, MID_CANVAS + 20);
            ctx.fillText("You have the choice to discard up to 4 cards, if you'd like to.", MID_CANVAS, MID_CANVAS + 40);

            ctx.font = "25px Arial";
            ctx.fillText("WIN / LOSS / PAYOUT", MID_CANVAS, MID_CANVAS + 100);

            ctx.font = "15px Arial";
            ctx.fillText("If you get anything other than a winning hand, then you lose your bet.", MID_CANVAS, MID_CANVAS + 140);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("ROYAL FLUSH : 250 to 1", MID_CANVAS, MID_CANVAS + 80);
            ctx.fillText("Ace, King, Queen, Jack, Ten all of the same suit.", MID_CANVAS, MID_CANVAS + 120);

            let royalFlush = 
            [
                new Card(suits[2], ranks[9]),
                new Card(suits[2], ranks[10]),
                new Card(suits[2], ranks[11]),
                new Card(suits[2], ranks[12]),
                new Card(suits[2], ranks[0]),
            ];

            drawHand(royalFlush, MID_CANVAS - 120);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("STRAIGHT FLUSH : 50 to 1", MID_CANVAS, MID_CANVAS + 80);
            ctx.fillText("Any five card sequence in the same suit.", MID_CANVAS, MID_CANVAS + 120);

            let straightFlush = 
            [
                new Card(suits[0], ranks[3]),
                new Card(suits[0], ranks[4]),
                new Card(suits[0], ranks[5]),
                new Card(suits[0], ranks[6]),
                new Card(suits[0], ranks[7]),
            ];

            drawHand(straightFlush, MID_CANVAS - 120);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("FOUR OF A KIND : 25 to 1", MID_CANVAS, MID_CANVAS + 80);
            ctx.fillText("All four cards of the same index.", MID_CANVAS, MID_CANVAS + 120);

            let fourOfAKind = 
            [
                new Card(suits[2], ranks[10]),
                new Card(suits[1], ranks[10]),
                new Card(suits[0], ranks[10]),
                new Card(suits[3], ranks[10]),
                new Card(suits[1], ranks[2]),
            ];

            drawHand(fourOfAKind, MID_CANVAS - 120);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("FULL HOUSE : 9 to 1", MID_CANVAS, MID_CANVAS + 80);
            ctx.fillText("Three of a kind combined with a pair.", MID_CANVAS, MID_CANVAS + 120);

            let fullHouse = 
            [
                new Card(suits[3], ranks[11]),
                new Card(suits[2], ranks[11]),
                new Card(suits[1], ranks[11]),
                new Card(suits[0], ranks[5]),
                new Card(suits[1], ranks[5]),
            ];

            drawHand(fullHouse, MID_CANVAS - 120);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("FLUSH : 6 to 1", MID_CANVAS, MID_CANVAS + 80);
            ctx.fillText("Any five cards of the same suit, but not in sequence.", MID_CANVAS, MID_CANVAS + 120);

            let flush = 
            [
                new Card(suits[0], ranks[2]),
                new Card(suits[0], ranks[10]),
                new Card(suits[0], ranks[8]),
                new Card(suits[0], ranks[5]),
                new Card(suits[0], ranks[1]),
            ];

            drawHand(flush, MID_CANVAS - 120);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("STRAIGHT : 4 to 1", MID_CANVAS, MID_CANVAS + 80);
            ctx.fillText("Five cards in sequence, but not in the same suit.", MID_CANVAS, MID_CANVAS + 120);

            let straight = 
            [
                new Card(suits[0], ranks[0]),
                new Card(suits[1], ranks[1]),
                new Card(suits[2], ranks[2]),
                new Card(suits[3], ranks[3]),
                new Card(suits[0], ranks[4]),
            ];

            drawHand(straight, MID_CANVAS - 120);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("THREE OF A KIND : 3 to 1", MID_CANVAS, MID_CANVAS + 80);
            ctx.fillText("Three cards of the same index.", MID_CANVAS, MID_CANVAS + 120);

            let threeOfAKind = 
            [
                new Card(suits[3], ranks[7]),
                new Card(suits[1], ranks[7]),
                new Card(suits[2], ranks[7]),
                new Card(suits[0], ranks[6]),
                new Card(suits[0], ranks[9]),
            ];

            drawHand(threeOfAKind, MID_CANVAS - 120);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("TWO PAIR : 2 to 1", MID_CANVAS, MID_CANVAS + 80);
            ctx.fillText("Two separate pairs.", MID_CANVAS, MID_CANVAS + 120);

            let twoPair = 
            [
                new Card(suits[0], ranks[11]),
                new Card(suits[1], ranks[11]),
                new Card(suits[2], ranks[6]),
                new Card(suits[3], ranks[6]),
                new Card(suits[0], ranks[0]),
            ];

            drawHand(twoPair, MID_CANVAS - 120);
        },

        function()
        {
            ctx.fillStyle = 'white';
            ctx.font = "15px Arial";
            ctx.fillText("PAIR : 1 to 1", MID_CANVAS, MID_CANVAS + 80);
            ctx.fillText("Two cards of the same index.", MID_CANVAS, MID_CANVAS + 120);

            let pair = 
            [
                new Card(suits[0], ranks[9]),
                new Card(suits[1], ranks[9]),
                new Card(suits[2], ranks[2]),
                new Card(suits[3], ranks[4]),
                new Card(suits[0], ranks[1]),
            ];

            drawHand(pair, MID_CANVAS - 120);
        },
    ];

    // Will only create the object array once upon loading
    if (Game.counter === 0)
    {
        createInstructionsEvents();
        Game.counter++;
    }

    drawBG();

    writeTitle();

    outputInstructionPages[pageIndex]();

    drawInstructionsChips();
    
    function writeTitle()
    {
        ctx.fillStyle = 'white';
        ctx.font = "30px Arial";
        ctx.fillText("POKER INSTRUCTIONS (" + (pageIndex + 1) + " / " + outputInstructionPages.length + ")", MID_CANVAS, INSTRUCTIONS_Y);
    }
}

// Upon clicking the "BLACKJACK" chip on the MORE screen.
function blackjackInstructions()
{
    const INSTRUCTIONS_Y = 50;
    const CARD_Y_1 = 75;
    const CARD_Y_2 = 300;

    let demoDeck = new Deck();

    // This array defines the functions to call depending on which instruction page you're on.
    outputInstructionPages = 
    [
        function() // Page 1 explains the card values.
        {
            drawDemoCards();

            drawArrows();

            writeInstructions();

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

            // Draws arrows pointing to cards.
            function drawArrows()
            {
                ctx.fillStyle = 'white';

                ctx.beginPath();
                ctx.moveTo(MID_CANVAS, MID_CANVAS - 65);
                ctx.lineTo(MID_CANVAS - 10, MID_CANVAS - 55);
                ctx.lineTo(MID_CANVAS + 10, MID_CANVAS - 55);
                ctx.rect(MID_CANVAS - 5, MID_CANVAS - 55, 10, 10);
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(230, CARD_Y_2 + (CARD_HEIGHT / 3) - 30);
                ctx.lineTo(240, CARD_Y_2 + (CARD_HEIGHT / 3) - 40);
                ctx.lineTo(240, CARD_Y_2 + (CARD_HEIGHT / 3) - 20);
                ctx.rect(240, CARD_Y_2 + (CARD_HEIGHT / 3) - 35, 30, 10);
                ctx.fill(); 

                ctx.beginPath();
                ctx.moveTo(270, CARD_Y_2 + (CARD_HEIGHT / 3) * 2 + 30);
                ctx.lineTo(260, CARD_Y_2 + (CARD_HEIGHT / 3) * 2 + 40);
                ctx.lineTo(260, CARD_Y_2 + (CARD_HEIGHT / 3) * 2 + 20);
                ctx.rect(230, CARD_Y_2 + (CARD_HEIGHT / 3 * 2) + 25, 30, 10);
                ctx.fill();
            }

            // Explains the card values.
            function writeInstructions()
            {
                ctx.fillStyle = 'white';
                ctx.font = "15px Arial";
                ctx.fillText("Ace is worth 1 or 11.", 250, CARD_Y_2 + (CARD_HEIGHT / 3));
                ctx.fillText("Numbered cards are worth their normal value.", MID_CANVAS, MID_CANVAS - 25);
                ctx.fillText("Face cards are worth 10.", 250, CARD_Y_2 + (CARD_HEIGHT / 3) * 2);
            }
        },

        function() // Page 2 explains the objective and the play.
        {
            ctx.fillStyle = 'white';
            ctx.font = "25px Arial";
            ctx.fillText("THE OBJECTIVE", MID_CANVAS, MID_CANVAS - 200);

            ctx.font = "15px Arial";
            ctx.fillText("The object of this card game is to beat the dealer's hand ", MID_CANVAS, MID_CANVAS - 160);
            ctx.fillText("by getting a count as close to 21 as possible.", MID_CANVAS, MID_CANVAS - 140);

            ctx.font = "25px Arial";
            ctx.fillText("THE PLAY", MID_CANVAS, MID_CANVAS - 80);

            ctx.font = "15px Arial";
            ctx.fillText("After placing your bet, you and the dealer both get two cards.", MID_CANVAS, MID_CANVAS - 40);
            ctx.fillText("One of the dealer's cards starts off face down.", MID_CANVAS, MID_CANVAS - 20);
            ctx.fillText('During your play, you can HIT to take as many cards as you want.', MID_CANVAS, MID_CANVAS + 20);
            ctx.fillText('(Before exceeding 21, obviously.)', MID_CANVAS, MID_CANVAS + 40);
            ctx.fillText("If you're feeling lucky, you can DOUBLE DOWN.", MID_CANVAS, MID_CANVAS + 80);
            ctx.fillText("This will double your bet for just one more card.", MID_CANVAS, MID_CANVAS + 100);
            ctx.fillText("Otherwise, you STAND when you're ready to play your hand.", MID_CANVAS, MID_CANVAS + 140);
        },

        function() // Page 3 explains how the payouts work. 
        {
            ctx.fillStyle = 'white';
            ctx.font = "25px Arial";
            ctx.fillText("WIN / LOSS / PAYOUT", MID_CANVAS, MID_CANVAS - 200);

            ctx.font = "15px Arial";
            ctx.fillText("Once you STAND, the dealer will flip its face down card", MID_CANVAS, MID_CANVAS - 160);
            ctx.fillText("and will HIT until its hand's total value is at least 17.",  MID_CANVAS, MID_CANVAS - 140);
            ctx.fillText("If you exceed 21, you will BUST and lose your bet.", MID_CANVAS, MID_CANVAS - 100);
            ctx.fillText("If you get a higher count than the dealer without going over 21, you win!", MID_CANVAS, MID_CANVAS - 60);
            ctx.fillText("You will get your bet back, and your profit will be 100% equal to your bet.", MID_CANVAS, MID_CANVAS - 40);
            ctx.fillText("If you're dealt an Ace and a card worth 10, this is known as a BLACKJACK.", MID_CANVAS, MID_CANVAS); 
            ctx.fillText("This will earn you 150% of profits instead of the normal 100%.", MID_CANVAS, MID_CANVAS + 20);
            ctx.fillText("If the player has the same total as the dealer, ", MID_CANVAS, MID_CANVAS + 60);
            ctx.fillText('this is known as a "standoff" and your bet is simply returned with no profit.', MID_CANVAS, MID_CANVAS + 80);
            ctx.fillText("An Ace's default value is 11, but if at any point you exceed 21", MID_CANVAS, MID_CANVAS + 120);
            ctx.fillText("with an Ace in hand, its value becomes 1, instead of making you BUST.", MID_CANVAS, MID_CANVAS + 140);
        },
    ];

    // Will only create the object array once upon loading
    if (Game.counter === 0)
    {
        createInstructionsEvents(demoDeck);
        Game.counter++;
    }

    drawBG();

    writeTitle();

    outputInstructionPages[pageIndex]();

    drawInstructionsChips();

    function writeTitle()
    {
        ctx.fillStyle = 'white';
        ctx.font = "30px Arial";
        ctx.fillText("BLACKJACK INSTRUCTIONS (" + (pageIndex + 1) + " / " + outputInstructionPages.length + ")", MID_CANVAS, INSTRUCTIONS_Y);
    }
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
            drawChip(MID_CANVAS, INSTRUCTION_CHIP_Y, "MENU", '#AA0000');
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
        canvasObjs[0] = new CanvasObject(MID_CANVAS, INSTRUCTION_CHIP_Y, 0, 0, CHIP_RADIUS);
        canvasObjs[0].clickCallback = function()
        {
            Game.context = 'MoreScreen';
    
            resetArray();

            pageIndex = 0;
        }
        canvasObjs[0].hoverCallback = function()
        {
            drawChip(MID_CANVAS, INSTRUCTION_CHIP_Y, "MENU", '#0000AA');
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
            else if (pageIndex === 0)
            {
                pageIndex = outputInstructionPages.length - 1;
            }

            resetArray();
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
            else if (pageIndex === outputInstructionPages.length - 1)
            {
                pageIndex = 0;
            }
            
            resetArray();
        }
        canvasObjs[2].hoverCallback = function()
        {
            drawChip((DEFAULT_CANVAS_SIZE / 4) * 3, INSTRUCTION_CHIP_Y, "NEXT", '#0000AA');
        }
    }
}