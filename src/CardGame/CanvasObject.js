const TABLET_BRKPNT = 800;
const MOBILE_BRKPNT = 500;

// This class defines a rectangular or circular canvas object that is clickable/hoverable.
class CanvasObject
{
    constructor(x, y, width, height, radius)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius;
        
        this.isHovered = false;

        // To be defined for each object
        this.clickCallback = null;
        this.hoverCallback = null;

        this.CheckRectHover = function(mouseX, mouseY)
        {
            if (mouseY > this.y && mouseY < this.y + this.height 
            && mouseX > this.x && mouseX < this.x + this.width) 
            {
                this.isHovered = true;
            }
            else
            {
                this.isHovered = false;
            }
        }

        this.checkRoundHover = function(mouseX, mouseY) // Distance between 2 points
        {
            if (Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2) < this.radius)
            {
                this.isHovered = true;
            }
            else
            {
                this.isHovered = false;
            }
        }
    }
}

// Ensures that click and hover events have proper coordinates based on screen size
function adjustMeasurements()
{
    var dynamicCanvasSize = 0;

    if (window.innerWidth > TABLET_BRKPNT) // Normal breakpoint > 800px
    {
        dynamicCanvasSize = DEFAULT_CANVAS_SIZE;
    }
    else if (window.innerWidth <= TABLET_BRKPNT && window.innerWidth > MOBILE_BRKPNT) // 800 px < Tablet breakpoint > 500px
    {
        dynamicCanvasSize = 0.81 * window.innerWidth;
    }
    else if (window.innerWidth <= MOBILE_BRKPNT) // Mobile breakpoint < 500px
    {
        dynamicCanvasSize = 0.9 * window.innerWidth;
    }

    return dynamicCanvasSize;
}

// Returns the mouse coordinate scaled based on the window size
function getModifiedMousePosition(event)
{
    let currentCanvasSize = adjustMeasurements();

    let ratio = DEFAULT_CANVAS_SIZE / currentCanvasSize;

    let mouse = 
    {
        x: (event.pageX - GAMECANVAS.offsetLeft) * ratio,
        y: (event.pageY - GAMECANVAS.offsetTop) * ratio
    };

    return mouse;
}

// Event listener for 'click' events.
GAMECANVAS.addEventListener('click', function(event) 
{
    let mouse = getModifiedMousePosition(event);
        
    for (let index = 0; index < canvasObjs.length; index++)
    {
        canvasObjs[index].CheckRectHover(mouse.x, mouse.y);
        if (!canvasObjs[index].isHovered)
        {
            canvasObjs[index].checkRoundHover(mouse.x, mouse.y);
        }

        if (canvasObjs[index].isHovered)
        {
            canvasObjs[index].clickCallback();
            break;
        }
    }
});

// Event listener for 'hover' events.
GAMECANVAS.addEventListener('mousemove', function(evt)
{
    let mouse = getModifiedMousePosition(event);

    // Just for debugging mouse coordinates
    console.log("Modified mouse coordinate: " + mouse.x, mouse.y);

    for (let index = 0; index < canvasObjs.length; index++)
    {
        canvasObjs[index].CheckRectHover(mouse.x, mouse.y);
        if (!canvasObjs[index].isHovered)
        {
            canvasObjs[index].checkRoundHover(mouse.x, mouse.y);
        }

        if (canvasObjs[index].isHovered)
        {
            canvasObjs[index].hoverCallback();
            break;
        }
    }
});