// CASINO CARD GAME       //
// DEVELOPED BY PHIL AUBE //

// Necessary for canvas interaction
const GAMECANVAS = document.getElementById("cardgame");
const ctx = GAMECANVAS.getContext("2d");

// General global constants
const CANVASSIZE = 600;

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
    cycleRGB(RGBTitleScreen);

    drawBG(color);

    drawTitle(color);

    drawCircles(RGBTitleScreen);

    drawFaceDown(100, 270);

    drawFaceDown(400, 270);

    drawChip(CANVASSIZE / 2, 280, 'SETTINGS');

    drawChip(CANVASSIZE / 2, 420, 'MORE');

    // Handles color and circle animation cycle
    function cycleRGB(RGBTitleScreen)
    {
        switch (RGBTitleScreen.counter)
        {
            case 0:
                color = '#FF0000';
                RGBTitleScreen.flicker = !RGBTitleScreen.flicker;
                break;
            case 50:
                color = '#00FF00';
                RGBTitleScreen.flicker = !RGBTitleScreen.flicker;
                break;
            case 100: 
                color = '#0000FF';
                RGBTitleScreen.flicker = !RGBTitleScreen.flicker;
                break;
            case 150:
                color = '#FF0000';
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
        ctx.beginPath();
        ctx.rect(0, 0, CANVASSIZE, CANVASSIZE);
        ctx.fillStyle = '#333';
        ctx.fill();

        ctx.font = "10px Arial";
        ctx.fillStyle = 'white';
        ctx.fillText("DISCLAIMER", CANVASSIZE / 2, 530);
        ctx.fillText("This game is just for fun.", CANVASSIZE / 2, 550);
        ctx.fillText("The developer is not responsible for your gambling addiction.", CANVASSIZE / 2, 570);
    }

    // Draws only the title
    function drawTitle(color)
    {
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeText("CASINO", CANVASSIZE / 2, 175);
    }

    // Flickers back and forth between to circle positions to create and LED animation effect
    function drawCircles(RGBTitleScreen)
    {
        if (RGBTitleScreen.flicker) // Default position
        {   
            // Top and bottom
            for (let y = 100; y <= 500; y += 400)
            {
                // Left to right
                for (let i = 0; i <= 500; i += 20)
                {
                    ctx.beginPath();
                    ctx.arc(50 + i, y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }

            // Left and right
            for (let x = 50; x <= 550; x += 500)
            {
                // Top to bottom
                for (let i = 0; i <= 400; i += 20)
                {
                    ctx.beginPath();
                    ctx.arc(x, 100 + i, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }
        }
        else // Swap circles with the gaps between them
        {
            // Top and bottom
            for (let y = 100; y <= 500; y += 400)
            {
                // Left to right
                for (let i = 10; i <= 500; i += 20)
                {
                    ctx.beginPath();
                    ctx.arc(50 + i, y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }

            // Left and right
            for (let x = 50; x <= 550; x += 500)
            {
                // Top to bottom
                for (let i = 10; i <= 400; i += 20)
                {
                    ctx.beginPath();
                    ctx.arc(x, 100 + i, 5, 0, 2 * Math.PI);
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
    const CARDHEIGHT = 150;
    const CARDWIDTH = 100;
    const XINC = 10;
    const YINC = 15;

    // Draw card background
    ctx.beginPath();
    ctx.rect(x, y, CARDWIDTH, CARDHEIGHT);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Draw Lines
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;

    let j = CARDHEIGHT;
    let i = 0;

    // Top to right
    for (i = 0; i < CARDWIDTH; i +=XINC)
    {
        ctx.beginPath();
        ctx.moveTo(x + i, y);
        ctx.lineTo(x + CARDWIDTH, y + j);
        ctx.stroke();

        j -= YINC; 
    }

    j = CARDHEIGHT;

    // Top to left
    for (i = CARDWIDTH; i > 0; i -= XINC)
    {
        ctx.beginPath();
        ctx.moveTo(x + i, y);
        ctx.lineTo(x, y + j);
        ctx.stroke();

        j -= YINC; 
    }

    j = 0;

    // Bottom to right
   for (i = YINC; i < CARDHEIGHT; i += YINC)
   {
       j += XINC;

       ctx.beginPath();
       ctx.moveTo(x + CARDWIDTH, y + i);
       ctx.lineTo(x + j, y + CARDHEIGHT);
       ctx.stroke();
   }

    j = CARDWIDTH;

    // Bottom to left
    for (i = YINC; i < CARDHEIGHT; i += YINC)
    {
        j -= XINC;

        ctx.beginPath();
        ctx.moveTo(x, y + i);
        ctx.lineTo(x + j, y + CARDHEIGHT);
        ctx.stroke();
    }

    // Draw card outline
    ctx.beginPath();
    ctx.rect(x, y, CARDWIDTH, CARDHEIGHT);
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

// Draw a casino chip with optional text
function drawChip(x, y, text = ' ')
{
    const CHIPRADIUS = 50;
    const GAP = 10;
    const SECTORS = 16;

    // Background
    ctx.beginPath();
    ctx.arc(x, y, CHIPRADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = '#AA0000';
    ctx.fill();

    // Draw lines
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    for (let i = 0; i <= SECTORS; i++)
    {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, CHIPRADIUS, i * (Math.PI / (SECTORS / 2)), i * (Math.PI / (SECTORS / 2)) + 1);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }

    // Center of the chip
    ctx.beginPath();
    ctx.arc(x, y, CHIPRADIUS - GAP, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    ctx.font = '15px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y + 5, (CHIPRADIUS * 2) - (GAP * 2));
}