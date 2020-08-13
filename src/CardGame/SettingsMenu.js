// * This file contains the menu for the "SETTINGS" chip on the title screen. * //

function settingsScreen()
{
    const SETTINGS_Y = 75;

    // Will only create the object array once upon loading
    if (Game.counter === 0)
    {
        createSettingsScreenEvents();
        Game.counter++;
    }

    drawBG();
    
    drawTitle();

    colorPicker();

    canvasObjs[3].isHovered ? canvasObjs[3].hoverCallback() : begForChips('#CCC');

    drawBackChip();

    function drawTitle()
    {
        ctx.fillStyle = 'white';
        ctx.font = "30px Arial";
        ctx.fillText("SETTINGS", MID_CANVAS, SETTINGS_Y);
    }
    
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
            canvasObjs[1].isHovered ? canvasObjs[1].hoverCallback() : drawLeftArrow('#CCC', MID_CANVAS - 100, 185);

            canvasObjs[2].isHovered ? canvasObjs[2].hoverCallback() : drawRightArrow('#CCC', MID_CANVAS + 50, 185);
        }
    }

    // If the user runs out of chips, they can get more here.
    function begForChips(color)
    {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(MID_CANVAS - 100, MID_CANVAS, 200, 50);
        ctx.fill();
        ctx.fillStyle = '#000'
        ctx.fillText("BEG FOR CHIPS", MID_CANVAS, MID_CANVAS + 35);
    }

    function drawBackChip()
    {
        canvasObjs[0].isHovered ? canvasObjs[0].hoverCallback() : drawChip(MID_CANVAS, DEFAULT_CANVAS_SIZE - 100, "BACK", '#AA0000');
    }

    // Creates the objects of each "SETTINGS" menu item, defining their click and hover callback functions.
    function createSettingsScreenEvents()
    {
        backChip();

        leftArrow();

        rightArrow();

        begButton();

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
                else if (Game.tableColor === 0)
                {
                    Game.tableColor = colors.length - 1;
                }
            }
            canvasObjs[1].hoverCallback = function()
            {
                drawLeftArrow('#FFF', MID_CANVAS - 100, 185);
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
                }
                else if (Game.tableColor === colors.length - 1)
                {
                    Game.tableColor = 0;
                }

                localStorage.setItem('tableColor', Game.tableColor);
            }
            canvasObjs[2].hoverCallback = function()
            {
                drawRightArrow('#FFF', MID_CANVAS + 50, 185);
            }
        }

        function begButton()
        {
            canvasObjs[3] = new CanvasObject(MID_CANVAS - 100, MID_CANVAS, 200, 50);
            canvasObjs[3].clickCallback = function()
            {
                if (Game.bank == 0)
                {
                    alert("You get 100 chips out of pity.");
                    Game.bank = 100;
                    localStorage.setItem('bank', 100);
                }
                else
                {
                    alert("Are you hiding some chips behind your back?");
                }
            }
            canvasObjs[3].hoverCallback = function()
            {
                begForChips('#FFF');
            }
        }
    }
}

