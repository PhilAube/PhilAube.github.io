// * This file contains the code for the actual Blackjack game itself. *//

function Blackjack()
{
    const BACK_CHIP_XY = DEFAULT_CANVAS_SIZE - 75;

    // Will only create the object array once upon loading
    if (Game.counter === 0)
    {
        createBJEvents();
        Game.counter++;
    }

    drawTable();

    drawTitle();

    drawBackChip();

    function drawTable()
    {
        drawBG();
        
        ctx.fillStyle = colors[Game.tableColor];;
        ctx.beginPath();
        ctx.rect(0, 0, DEFAULT_CANVAS_SIZE, DEFAULT_CANVAS_SIZE - 150);
        ctx.fill();
    }

    function drawTitle()
    {
        ctx.fillStyle = 'white';
        ctx.font = "30px Arial";
        ctx.fillText("BLACKJACK", DEFAULT_CANVAS_SIZE - 225, DEFAULT_CANVAS_SIZE - 65);
    }

    function drawBackChip()
    {
        canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawChip(BACK_CHIP_XY, BACK_CHIP_XY, "BACK", '#AA0000');
    }

    // Creates events for the Blackjack game.
    function createBJEvents()
    {
        backChip();

        function backChip()
        {
            canvasObjs[0] = new CanvasObject(BACK_CHIP_XY, BACK_CHIP_XY, 0, 0, CHIP_RADIUS);
            canvasObjs[0].clickCallback = function()
            {
                Game.context = 'TitleScreen';
            
                resetArray();
            }
            canvasObjs[0].hoverCallback = function()
            {
                drawChip(BACK_CHIP_XY, BACK_CHIP_XY, "BACK", '#0000AA');
            }
        }
    }
}