// * This file contains the menu for the "MORE" chip' on the title screen. * //

function moreScreen()
{
    const TITLE_Y = 75;
    const LEFT = DEFAULT_CANVAS_SIZE / 3 - 50; 
    const RIGHT = DEFAULT_CANVAS_SIZE / 3 * 2 + 50;
    const TOP = 375;
    const BOTTOM = 525;

    // Will only create the object array once upon loading
    if (Game.counter === 0)
    {
        createMoreScreenEvents();
        Game.counter++;
    }

    drawBG();

    drawTitle('red', TITLE_Y);

    drawInfo();

    drawMenuChips();

    // Draws the menu item chips for the "MORE" menu.
    function drawMenuChips()
    {
        canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawChip(LEFT, TOP, "BACK", '#AA0000'); // Red
    
        canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawChip(RIGHT, TOP, 'CONTACT', '#AA0000'); // Red
    
        ctx.font = "20px Arial";
        ctx.fillText("INSTRUCTIONS", MID_CANVAS, BOTTOM + 5);
    
        canvasObjs[2].isHovered ? canvasObjs[2].hoverCallback() : drawChip(LEFT, BOTTOM, "BLACKJACK", '#AA0000'); // Red

        canvasObjs[3].isHovered ? canvasObjs[3].hoverCallback() : drawChip(RIGHT, BOTTOM, "POKER", '#AA0000'); // Red
    }

    // Writes the additional info in the "MORE" menu.
    function drawInfo()
    {
        ctx.fillStyle = 'white';
        ctx.font = "15px Arial";
        ctx.fillText("Version 0.13 © 2020-2021", MID_CANVAS, TITLE_Y + 40);
        ctx.fillText("This game was developed from scratch by Phil Aube.", MID_CANVAS, TITLE_Y + 80);
        ctx.fillText("Created with HTML canvas and JavaScript without external libraries.", MID_CANVAS, TITLE_Y + 120);
        ctx.fillText('This game is currently a work in progress. Thanks for trying it out!', MID_CANVAS, TITLE_Y + 160);
        ctx.fillText('Found a bug? You can report it under the CONTACT section of my GitHub Pages!', MID_CANVAS, TITLE_Y + 200);
    }

    // Creates the objects of each "MORE" menu item, defining their click and hover callback functions.
    function createMoreScreenEvents()
    {
        backChip();

        contactChip();

        blackjackChip();

        pokerChip();

        function backChip()
        {
            canvasObjs[0] = new CanvasObject(LEFT, TOP, 0, 0, CHIP_RADIUS);
            canvasObjs[0].clickCallback = function()
            {
                Game.context = 'TitleScreen';
        
                resetArray();
            }
            canvasObjs[0].hoverCallback = function()
            {
                drawChip(LEFT, TOP, "BACK", '#0000AA'); // Blue
            }
        }

        function contactChip()
        {
            canvasObjs[1] = new CanvasObject(RIGHT, TOP, 0, 0, CHIP_RADIUS);
            canvasObjs[1].clickCallback = function()
            {
                window.open("http://philaube.github.io/contact.html");
            }
            canvasObjs[1].hoverCallback = function()
            {
                drawChip(RIGHT, TOP, 'CONTACT', '#0000AA'); // Blue
            }
        }

        function blackjackChip()
        {
            canvasObjs[2] = new CanvasObject(LEFT, BOTTOM, 0, 0, CHIP_RADIUS);
            canvasObjs[2].clickCallback = function()
            {
                Game.context = 'BJInstructions';

                resetArray();
            }
            canvasObjs[2].hoverCallback = function()
            {
                drawChip(LEFT, BOTTOM, "BLACKJACK", '#0000AA'); // BLue
            }
        }

        function pokerChip()
        {
            canvasObjs[3] = new CanvasObject(RIGHT, BOTTOM, 0, 0, CHIP_RADIUS);
            canvasObjs[3].clickCallback = function()
            {
                Game.context = 'PokerInstructions';

                resetArray();
            }
            canvasObjs[3].hoverCallback = function()
            {
                drawChip(RIGHT, BOTTOM, "POKER", '#0000AA'); // Blue
            }
        }
    }
}
