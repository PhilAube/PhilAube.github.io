// * This file contains general code used throughout the game, mostly drawing. * //

// Removes all canvas objects from array when loading a new page.
function resetArray()
{
    while (canvasObjs.length > 0)
    {
        canvasObjs.pop();
    }

    Game.counter = 0;
}

// * DRAWING FUNCTIONS * //

// Draws the game's title.
function drawTitle(color, title_Y)
{
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeText("CASINO", MID_CANVAS, title_Y);
}

// Simply draws the menu's background color.
function drawBG()
{
    ctx.beginPath();
    ctx.rect(0, 0, DEFAULT_CANVAS_SIZE, DEFAULT_CANVAS_SIZE);
    ctx.fillStyle = '#333'; // Gray
    ctx.fill();
}

// Draws a face down card.
function drawFaceDown(x, y, color)
{
    const X_INC = 10;
    const Y_INC = 15;

    // Draw card background
    ctx.beginPath();
    ctx.rect(x, y, CARD_WIDTH, CARD_HEIGHT);
    ctx.fillStyle = color; // Default is white, hovered is gray
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

// Draws a casino chip with optional text.
function drawChip(x, y, text = ' ', chipColor)
{
    const GAP = 10;
    const SECTORS = 16;

    // Background
    ctx.beginPath();
    ctx.arc(x, y, CHIP_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = chipColor; // Red by default, blue on hover
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

// For drawing a 5 card hand nicely spread out accross the canvas.
function drawHand(hand, y)
{
    // X values for 5 cards evenly spread across the canvas
    let xValues = [ 10, 130, 250, 370, 490 ];

    for (let i = 0; i < hand.length; i++)
    {
        hand[i].drawCard(xValues[i], y);
    }
}