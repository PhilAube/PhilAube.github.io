// * This file contains all the code for the RGB title screen for the Casino game. * //

function titleScreen()
{
    const BLACKJACK_X = 100;
    const POKER_X = 400;
    const CARD_Y = 270;
    const SETTINGS_CHIP_Y = 280;
    const MORE_CHIP_Y = 420;
    const TITLE_Y = 175;

    // Will only create the object array once upon loading
    if (Game.counter === 0)
    {
        createTitleScreenEvents(canvasObjs); 
        Game.counter++;
    }

    cycleRGB();

    drawTitleBG();

    drawTitle(color, TITLE_Y);

    drawLEDCircles();

    drawCards();

    drawChips();

    // Draws the two chips in the title screen based on whether or not they're hovered.
    function drawChips()
    {
        if (canvasObjs[2].isHovered) // Settings
        {
            canvasObjs[2].hoverCallback();
        }
        else
        {
            drawChip(MID_CANVAS, SETTINGS_CHIP_Y, 'SETTINGS', '#AA0000'); // Red
        }
    
        if (canvasObjs[3].isHovered) // More
        {
            canvasObjs[3].hoverCallback();
        }
        else
        {
            drawChip(MID_CANVAS, MORE_CHIP_Y, 'MORE', '#AA0000'); // Red
        }
    }

    // Draws the two cards in the title screen based on whether or not they're hovered.
    function drawCards()
    {
        if (canvasObjs[0].isHovered) // Blackjack
        {
            canvasObjs[0].hoverCallback();
        }
        else
        {
            drawFaceDown(BLACKJACK_X, CARD_Y, 'white');
        }

        if (canvasObjs[1].isHovered) // Poker
        {
            canvasObjs[1].hoverCallback();
        }
        else
        {
            drawFaceDown(POKER_X, CARD_Y, 'white');
        }
    }

    // Creates the canvas event objects of each menu item for the Title Screen, defining their click and hover callback functions.
    function createTitleScreenEvents(canvasObjs)
    {
        blackjackCard();

        pokerCard();

        settingsChip();

        moreChip();

        function blackjackCard()
        {
            canvasObjs[0] = new CanvasObject(BLACKJACK_X, CARD_Y, CARD_WIDTH, CARD_HEIGHT);
            canvasObjs[0].clickCallback = function()
            {
                alert('BLACKJACK: UNDER CONSTRUCTION');
            }
            canvasObjs[0].hoverCallback = function()
            {
                drawFaceDown(BLACKJACK_X, CARD_Y, '#333'); // Gray
                ctx.font = '20px Arial';
                ctx.fillStyle = 'white';
                ctx.fillText("BLACK", BLACKJACK_X + (CARD_WIDTH / 2), CARD_Y + (CARD_HEIGHT / 2) - 15);
                ctx.fillText("JACK", BLACKJACK_X + (CARD_WIDTH / 2), CARD_Y + (CARD_HEIGHT / 2) + 15);
            }
        }

        function pokerCard()
        {
            canvasObjs[1] = new CanvasObject(POKER_X, CARD_Y, CARD_WIDTH, CARD_HEIGHT);
            canvasObjs[1].clickCallback = function()
            {
                alert('POKER: UNDER CONSTRUCTION');
            }
            canvasObjs[1].hoverCallback = function()
            {
                drawFaceDown(POKER_X, CARD_Y, '#333'); // Gray
                ctx.font = '20px Arial';
                ctx.fillStyle = 'white';
                ctx.fillText("POKER", POKER_X + (CARD_WIDTH / 2), CARD_Y + (CARD_HEIGHT / 2));
            }
        }

        function settingsChip()
        {
            canvasObjs[2] = new CanvasObject(MID_CANVAS, SETTINGS_CHIP_Y, 0, 0, CHIP_RADIUS);
            canvasObjs[2].clickCallback = function()
            {
                Game.context = 'SettingsScreen';
    
                // REMOVE ALL CURRENT CANVAS OBJECTS
                while (canvasObjs.length > 0)
                {
                    canvasObjs.pop();
                }

                Game.counter = 0;
            }
            canvasObjs[2].hoverCallback = function()
            {
                drawChip(MID_CANVAS, SETTINGS_CHIP_Y, 'SETTINGS', '#0000AA');
            }
        }

        function moreChip()
        {
            canvasObjs[3] = new CanvasObject(MID_CANVAS, MORE_CHIP_Y, 0, 0, CHIP_RADIUS);
            canvasObjs[3].clickCallback = function()
            {
                Game.context = 'MoreScreen';
    
                // REMOVE ALL CURRENT CANVAS OBJECTS
                while (canvasObjs.length > 0)
                {
                    canvasObjs.pop();
                }

                Game.counter = 0;
            }
            canvasObjs[3].hoverCallback = function()
            {
                drawChip(MID_CANVAS, MORE_CHIP_Y, 'MORE', '#0000AA');
            }
        }
    }

    // Handles color and circle animation cycle.
    function cycleRGB()
    {
        switch (Game.RGBTitleScreen.cycleCounter)
        {
            case 0:
                color = '#FF0000'; // Red
                Game.RGBTitleScreen.flicker = !Game.RGBTitleScreen.flicker;
                break;
            case 50:
                color = '#00FF00'; // Green
                Game.RGBTitleScreen.flicker = !Game.RGBTitleScreen.flicker;
                break;
            case 100: 
                color = '#0000FF'; // Blue
                Game.RGBTitleScreen.flicker = !Game.RGBTitleScreen.flicker;
                break;
            case 150:
                color = '#FF0000'; // Reset
                Game.RGBTitleScreen.cycleCounter = 0;
                Game.RGBTitleScreen.flicker = !Game.RGBTitleScreen.flicker;
                break;
            default:
                break;
        }
    
        Game.RGBTitleScreen.cycleCounter++;
    }

    // Draws Title screen background color with disclaimer.
    function drawTitleBG()
    {
        const DISCLAIMER_Y = 530;

        drawBG();

        ctx.font = "10px Arial";
        ctx.fillStyle = 'white';
        ctx.fillText("DISCLAIMER", MID_CANVAS, DISCLAIMER_Y);
        ctx.fillText("This game is just for fun.", MID_CANVAS, DISCLAIMER_Y + 20);
        ctx.fillText("The developer is not responsible for your gambling addiction.", MID_CANVAS, DISCLAIMER_Y + 40);
    }

    // Flickers back and forth between to circle positions to create and LED animation effect.
    function drawLEDCircles()
    {
        const TOP = 100;
        const BOTTOM = 500;
        const HEIGHT = BOTTOM - TOP;
        
        const LEFT = 50;
        const RIGHT = 550;
        const WIDTH = RIGHT - LEFT;

        const RADIUS = 5;
        const CIRCLE_GAP = RADIUS * 4;
        const OFFSET = 10;

        if (Game.RGBTitleScreen.flicker) // Default position
        {   
            // Top and bottom
            for (let y = TOP; y <= BOTTOM; y += HEIGHT)
            {
                // Left to right
                for (let i = 0; i <= WIDTH; i += CIRCLE_GAP)
                {
                    ctx.beginPath();
                    ctx.arc(LEFT + i, y, RADIUS, 0, 2 * Math.PI);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }

            // Left and right
            for (let x = LEFT; x <= RIGHT; x += WIDTH)
            {
                // Top to bottom
                for (let i = 0; i <= HEIGHT; i += CIRCLE_GAP)
                {
                    ctx.beginPath();
                    ctx.arc(x, TOP + i, RADIUS, 0, 2 * Math.PI);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }
        }
        else // Swap circles with the gaps between them
        {
            // Top and bottom
            for (let y = TOP; y <= BOTTOM; y += HEIGHT)
            {
                // Left to right
                for (let i = OFFSET; i <= WIDTH; i += CIRCLE_GAP)
                {
                    ctx.beginPath();
                    ctx.arc(LEFT + i, y, RADIUS, 0, 2 * Math.PI);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }

            // Left and right
            for (let x = LEFT; x <= RIGHT; x += WIDTH)
            {
                // Top to bottom
                for (let i = OFFSET; i <= HEIGHT; i += CIRCLE_GAP)
                {
                    ctx.beginPath();
                    ctx.arc(x, TOP + i, RADIUS, 0, 2 * Math.PI);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }
        }
    }
}