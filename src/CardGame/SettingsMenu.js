// * This file contains the menu for the "SETTINGS" chip on the title screen. * //

function settingsScreen()
{
    const SETTINGS_Y = 100;

    // Will only create the object array once upon loading
    if (Game.counter === 0)
    {
        createSettingsScreenEvents();
        Game.counter++;
    }

    drawBG();

    ctx.fillStyle = 'white';
    ctx.font = "30px Arial";
    ctx.fillText("SETTINGS", DEFAULT_CANVAS_SIZE / 2, SETTINGS_Y);

    drawBackChip();

    function drawBackChip()
    {
        if (canvasObjs[0].isHovered)
        {
            canvasObjs[0].hoverCallback();
        }
        else
        {
            drawChip(DEFAULT_CANVAS_SIZE / 2, DEFAULT_CANVAS_SIZE - 100, "BACK", '#AA0000');
        }
    }

    // Creates the objects of each "SETTINGS" menu item, defining their click and hover callback functions.
    function createSettingsScreenEvents()
    {
        backChip();

        function backChip()
        {
            canvasObjs[0] = new CanvasObject(DEFAULT_CANVAS_SIZE / 2, DEFAULT_CANVAS_SIZE - 100, 0, 0, CHIP_RADIUS);
            canvasObjs[0].clickCallback = function()
            {
                Game.context = 'TitleScreen';
            
                resetArray();
            }
            canvasObjs[0].hoverCallback = function()
            {
                drawChip(DEFAULT_CANVAS_SIZE / 2, DEFAULT_CANVAS_SIZE - 100, "BACK", '#0000AA');
            }
        }
    }
}

