// CASINO CARD GAME       //
// DEVELOPED BY PHIL AUBE //

// Necessary for canvas interaction
const GAMECANVAS = document.getElementById("cardgame");
const ctx = GAMECANVAS.getContext("2d");

// General global constants
const CANVAS_SIZE = 600;
const CARD_HEIGHT = 150;
const CARD_WIDTH = 100;

// For the color changing title screen
let RGBTitleScreen = { counter : 0, flicker: true , show: true };

// The first domino in the whole application
window.onload = animate;

// The main animation loop
function animate()
{
    if (RGBTitleScreen.show)
        titleScreen(RGBTitleScreen);

    requestAnimationFrame(animate);
}

// The main title screen for the Casino game
function titleScreen(RGBTitleScreen)
{
    const BLACKJACK_X = 100;
    const POKER_X = 400;
    const CARD_Y = 270;
    const SETTINGS_CHIP_Y = 280;
    const MORE_CHIP_Y = 420;
    const TITLE_Y = 175;

    cycleRGB(RGBTitleScreen);

    drawBG(color);

    drawTitle(color, TITLE_Y);

    drawLEDCircles(RGBTitleScreen);

    drawFaceDown(BLACKJACK_X, CARD_Y);

    drawFaceDown(POKER_X, CARD_Y);

    drawChip(CANVAS_SIZE / 2, SETTINGS_CHIP_Y, 'SETTINGS');

    drawChip(CANVAS_SIZE / 2, MORE_CHIP_Y, 'MORE');

    // Handles color and circle animation cycle
    function cycleRGB(RGBTitleScreen)
    {
        switch (RGBTitleScreen.counter)
        {
            case 0:
                color = '#FF0000'; // Red
                RGBTitleScreen.flicker = !RGBTitleScreen.flicker;
                break;
            case 50:
                color = '#00FF00'; // Green
                RGBTitleScreen.flicker = !RGBTitleScreen.flicker;
                break;
            case 100: 
                color = '#0000FF'; // Blue
                RGBTitleScreen.flicker = !RGBTitleScreen.flicker;
                break;
            case 150:
                color = '#FF0000'; // Reset
                RGBTitleScreen.counter = 0;
                RGBTitleScreen.flicker = !RGBTitleScreen.flicker;
                break;
            default:
                break;
        }
    
        RGBTitleScreen.counter++;
    }

    // Draws background color with disclaimer
    function drawBG(color)
    {
        const DISCLAIMER_Y = 530;

        ctx.beginPath();
        ctx.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.fillStyle = '#333'; // Gray
        ctx.fill();

        ctx.font = "10px Arial";
        ctx.fillStyle = 'white';
        ctx.fillText("DISCLAIMER", CANVAS_SIZE / 2, DISCLAIMER_Y);
        ctx.fillText("This game is just for fun.", CANVAS_SIZE / 2, DISCLAIMER_Y + 20);
        ctx.fillText("The developer is not responsible for your gambling addiction.", CANVAS_SIZE / 2, DISCLAIMER_Y + 40);
    }

    // Draws only the title
    function drawTitle(color, title_Y)
    {
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeText("CASINO", CANVAS_SIZE / 2, title_Y);
    }

    // Flickers back and forth between to circle positions to create and LED animation effect
    function drawLEDCircles(RGBTitleScreen)
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

        if (RGBTitleScreen.flicker) // Default position
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

// Draw a face down card
function drawFaceDown(x, y)
{
    const X_INC = 10;
    const Y_INC = 15;

    // Draw card background
    ctx.beginPath();
    ctx.rect(x, y, CARD_WIDTH, CARD_HEIGHT);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Draw Lines
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;

    let j = CARD_HEIGHT;
    let i = 0;

    // Top to right
    for (i = 0; i < CARD_WIDTH; i +=X_INC)
    {
        ctx.beginPath();
        ctx.moveTo(x + i, y);
        ctx.lineTo(x + CARD_WIDTH, y + j);
        ctx.stroke();

        j -= Y_INC; 
    }

    j = CARD_HEIGHT;

    // Top to left
    for (i = CARD_WIDTH; i > 0; i -= X_INC)
    {
        ctx.beginPath();
        ctx.moveTo(x + i, y);
        ctx.lineTo(x, y + j);
        ctx.stroke();

        j -= Y_INC; 
    }

    j = 0;

    // Bottom to right
   for (i = Y_INC; i < CARD_HEIGHT; i += Y_INC)
   {
       j += X_INC;

       ctx.beginPath();
       ctx.moveTo(x + CARD_WIDTH, y + i);
       ctx.lineTo(x + j, y + CARD_HEIGHT);
       ctx.stroke();
   }

    j = CARD_WIDTH;

    // Bottom to left
    for (i = Y_INC; i < CARD_HEIGHT; i += Y_INC)
    {
        j -= X_INC;

        ctx.beginPath();
        ctx.moveTo(x, y + i);
        ctx.lineTo(x + j, y + CARD_HEIGHT);
        ctx.stroke();
    }

    // Draw card outline
    ctx.beginPath();
    ctx.rect(x, y, CARD_WIDTH, CARD_HEIGHT);
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

// Draw a casino chip with optional text
function drawChip(x, y, text = ' ')
{
    const CHIP_RADIUS = 50;
    const GAP = 10;
    const SECTORS = 16;

    // Background
    ctx.beginPath();
    ctx.arc(x, y, CHIP_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = '#AA0000'; // Red
    ctx.fill();

    // Draw lines
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    for (let i = 0; i <= SECTORS; i++)
    {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, CHIP_RADIUS, i * (Math.PI / (SECTORS / 2)), i * (Math.PI / (SECTORS / 2)) + 1);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }

    // Center of the chip
    ctx.beginPath();
    ctx.arc(x, y, CHIP_RADIUS - GAP, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    ctx.font = '15px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y + 5, (CHIP_RADIUS * 2) - (GAP * 2));
}