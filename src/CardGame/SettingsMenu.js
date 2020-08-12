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

    colorPicker();

    drawTitle();

    drawBackChip();
    
    // Allows the user to choose from an array of colors.
    function colorPicker()
    {
        drawTitle();

        showSampleColor();
        
        drawArrows();

        function drawTitle()
        {
            ctx.fillStyle = 'white';
            ctx.font = "20px Arial";
            ctx.fillText("TABLE COLOR", MID_CANVAS, 150);
        }

        function showSampleColor()
        {
            ctx.fillStyle = colors[Game.tableColor];
            ctx.beginPath();
            ctx.rect(MID_CANVAS - 35, 175, 70, 70);
            ctx.fill();

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.rect(MID_CANVAS - 35, 175, 70, 70);
            ctx.stroke();
        }

        function drawArrows()
        {
            canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawLeftArrow('#CCC');

            canvasObjs[2].isHovered ? canvasObjs[2].hoverCallback() : drawRightArrow('#CCC');
        }
    }

    function drawTitle()
    {
        ctx.fillStyle = 'white';
        ctx.font = "30px Arial";
        ctx.fillText("SETTINGS", MID_CANVAS, SETTINGS_Y);
    }

    function drawBackChip()
    {
        canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawChip(MID_CANVAS, DEFAULT_CANVAS_SIZE - 100, "BACK", '#AA0000');
    }

    function drawLeftArrow(color)
    {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(MID_CANVAS - 100, 185, 50, 50);
        ctx.fill();

        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.moveTo(230, 220);
        ctx.lineTo(220, 210);
        ctx.lineTo(230, 200);
        ctx.fill();
    }

    function drawRightArrow(color)
    {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(MID_CANVAS + 50, 185, 50, 50);
        ctx.fill();

        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.moveTo(MID_CANVAS + 70, 220);
        ctx.lineTo(MID_CANVAS + 80, 210);
        ctx.lineTo(MID_CANVAS + 70, 200);
        ctx.fill();
    }

    // Creates the objects of each "SETTINGS" menu item, defining their click and hover callback functions.
    function createSettingsScreenEvents()
    {
        backChip();

        leftArrow();

        rightArrow();

        function backChip()
        {
            canvasObjs[0] = new CanvasObject(MID_CANVAS, DEFAULT_CANVAS_SIZE - 100, 0, 0, CHIP_RADIUS);
            canvasObjs[0].clickCallback = function()
            {
                Game.context = 'TitleScreen';
            
                resetArray();
            }
            canvasObjs[0].hoverCallback = function()
            {
                drawChip(MID_CANVAS, DEFAULT_CANVAS_SIZE - 100, "BACK", '#0000AA');
            }
        }

        function leftArrow()
        {
            canvasObjs[1] = new CanvasObject(MID_CANVAS - 100, 185, 50, 50);
            canvasObjs[1].clickCallback = function()
            {
                if (Game.tableColor > 0)
                {
                    Game.tableColor--;
                    localStorage.setItem('tableColor', Game.tableColor);
                }
            }
            canvasObjs[1].hoverCallback = function()
            {
                drawLeftArrow('#FFF')
            }
        }

        function rightArrow()
        {
            canvasObjs[2] = new CanvasObject(MID_CANVAS + 50, 185, 50, 50);
            canvasObjs[2].clickCallback = function()
            {
                if (Game.tableColor < colors.length - 1)
                {
                    Game.tableColor++;
                    localStorage.setItem('tableColor', Game.tableColor);
                }
            }
            canvasObjs[2].hoverCallback = function()
            {
                drawRightArrow('#FFF')
            }
        }
    }
}

