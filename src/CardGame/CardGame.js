// * CASINO CARD GAME * //
// * DEVELOPED BY PHIL AUBE * //

// Necessary for canvas interaction
const GAMECANVAS = document.getElementById("cardgame");
const ctx = GAMECANVAS.getContext("2d");

// General global constants
const DEFAULT_CANVAS_SIZE = 600;
const MID_CANVAS = DEFAULT_CANVAS_SIZE / 2;
const CARD_HEIGHT = 150;
const CARD_WIDTH = 100;
const CHIP_RADIUS = 50;

// Color array for custom table color
const colors = [ '#008800', '#30fc3e','#AA0000', '#ff3d3d', /*'#F60', '#FD0',*/ '#0404e0', '#66ccff', '#111', '#888', '#ff14d4', '#b700ff' ];

// Specific to philaube.github.io
const TABLET_BRKPNT = 800;
const MOBILE_BRKPNT = 500;

// An array for storing the canvas objects for events.
let canvasObjs = [];

// This Game Object manages colors, object/event creation for each screen based on context and saved information.
let Game = 
{
    RGBTitleScreen : { cycleCounter : 0, flicker: true, mobile: window.mobileAndTabletCheck() },
    counter: 0,
    context: 'TitleScreen',
    tableColor: getTableColor(),
    bet : 0,
    bank : getBank(),
    betIncrement : 10,
    deck : new Deck(),
    frameCounter : 0,
    lastTimedEvent : 0,
    CPUHand : new Hand(),
    userHand : new Hand(),
    handValue : 0,
    prevCounter: null
};

// The first domino in the whole application.
window.onload = animate;

// The main animation loop.
function animate()
{
    switch (Game.context)
    {
        case 'TitleScreen':
            titleScreen();
            break;
        case 'MoreScreen':
            moreScreen();
            break;
        case 'SettingsScreen':
            settingsScreen();
            break;
        case 'BJInstructions':
            blackjackInstructions();
            break;
        case 'PokerInstructions':
            pokerInstructions();
            break
        case 'Blackjack':
            Blackjack();
            break;
        case 'Poker':
            Poker();
            break;
    }

    Game.frameCounter++;
    requestAnimationFrame(animate);
}

// * EVENT LISTENING * //

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
        }
    }
});

// Event listener for 'hover' events.
GAMECANVAS.addEventListener('mousemove', function(evt)
{
    let mouse = getModifiedMousePosition(event);

    // For debugging mouse coordinates
    // console.log("Modified mouse coordinate: " + mouse.x, mouse.y);

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
        }
    }
});

// Returns the mouse coordinate scaled based on the window size.
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

// Ensures that click and hover events have proper coordinates based on screen size.
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