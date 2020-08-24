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

// For resetting the hands.
function resetHand(hand)
{
    while (hand.cards.length > 0)
    {
        hand.cards.pop();
    }
}

// Checks if there is a preferred table color and sets the default (green) if there is none.
function getTableColor()
{
    if (!localStorage.getItem('tableColor'))
    {
        localStorage.setItem('tableColor', 0);
        return localStorage.getItem('tableColor');
    }
    else
    {
        return localStorage.getItem('tableColor');
    }
}

// Checks if the user has a bank, and sets the default (100) if there is none.
function getBank()
{
    if (!localStorage.getItem('bank'))
    {
        localStorage.setItem('bank', 100);
        return localStorage.getItem('bank');
    }
    else
    {
        return localStorage.getItem('bank');
    }
}

// * DRAWING FUNCTIONS * //

// Draws the outline and background of the Betting box.
function drawBox(text)
{
    ctx.beginPath();
    ctx.rect(150, 100, 300, 275);
    ctx.fillStyle = '#333';
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.rect(150, 100, 300, 275);
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.fillText(text, MID_CANVAS, 150);
}

// Draws the game table with the name and bank.
function drawTable(gameName)
{
    drawBG();
    
    ctx.fillStyle = colors[Game.tableColor];
    ctx.beginPath();
    ctx.rect(0, 0, DEFAULT_CANVAS_SIZE, DEFAULT_CANVAS_SIZE - 150);
    ctx.fill();

    ctx.beginPath();
    ctx.rect(0, DEFAULT_CANVAS_SIZE - 150, DEFAULT_CANVAS_SIZE, 150);
    ctx.strokeStyle = 'white';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(DEFAULT_CANVAS_SIZE / 4 * 3, DEFAULT_CANVAS_SIZE - 150);
    ctx.lineTo(DEFAULT_CANVAS_SIZE / 4 * 3, DEFAULT_CANVAS_SIZE);
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.font = "20px Arial";
    ctx.fillText(gameName, DEFAULT_CANVAS_SIZE / 8 * 7, DEFAULT_CANVAS_SIZE - 125);

    ctx.fillStyle = 'white';
    ctx.font = "15px Arial";
    ctx.fillText("BANK", DEFAULT_CANVAS_SIZE / 8 * 7, DEFAULT_CANVAS_SIZE - 100);
    ctx.fillText(Game.bank, DEFAULT_CANVAS_SIZE / 8 * 7, DEFAULT_CANVAS_SIZE - 75, DEFAULT_CANVAS_SIZE / 4);
}

// Draws the Menu Button.
function drawMenu()
{
    ctx.fillStyle = '#CCC';
    ctx.beginPath();
    ctx.rect(DEFAULT_CANVAS_SIZE / 4 * 3, DEFAULT_CANVAS_SIZE - 65, DEFAULT_CANVAS_SIZE / 4, 65);
    ctx.fill();
    
    ctx.fillStyle = '#111';
    ctx.font = "20px Arial";
    ctx.fillText("MENU", DEFAULT_CANVAS_SIZE / 8 * 7, DEFAULT_CANVAS_SIZE - 25);
}

// For colorPicker and wager.
function drawLeftArrow(color, x, y)
{
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, y, 50, 50);
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.moveTo(x + 30, y + 35);
    ctx.lineTo(x + 20, y + 25);
    ctx.lineTo(x + 30, y + 15);
    ctx.fill();
}

// For colorPicker and wager.
function drawRightArrow(color, x, y)
{
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, y, 50, 50);
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 35);
    ctx.lineTo(x + 30, y + 25);
    ctx.lineTo(x + 20, y + 15);
    ctx.fill();
}

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
    ctx.lineWidth = 1;

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