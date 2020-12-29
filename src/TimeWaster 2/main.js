// WEB PROGRAMMING 1 PROJECT 
// DEVELOPED BY : PHIL AUBE

// SETUP : Necessary for canvas interaction
const canvas = document.getElementById('timewaster');
const ctx = canvas.getContext('2d');

// SETUP : Constants
const CANVAS_SIZE = 500;
const MID_CANVAS = CANVAS_SIZE / 2;
const MAX_X_ENTITIES = 30;
const MAX_O_ENTITIES = 30;

const MAGENTA = '#FF00FF';
const CYAN = '#00FFFF';
const GREEN = '#00FF00';
const RED = '#FF0000';
const YELLOW = '#FFF000';

// SETUP : Launch recursive animation loop when DOM is ready.
window.addEventListener('DOMContentLoaded', main);

// Global game object keeps track of various states/information.
let game = 
{
    context : '0',
    frameCounter : 0,
    lastTimedEvent : 0,
    color : '#000',
    levelNumber : 0,
    player : new Entity(MID_CANVAS, MID_CANVAS, drawSquare),
    speed : 1,
    pause : false,
    lives : 1,
    totalLives : 1,
    xArray : [],
    oArray : [],
    score : 0,
    oQty : MAX_O_ENTITIES,
    xQty : MAX_X_ENTITIES,
    xFollow : false,
    allowKeyPress : true
};

// An array of sounds for quick access.
let sounds = 
{
    countdown : new Audio("src/TimeWaster 2/sound/321.mp3"),
    go : new Audio("src/TimeWaster 2/sound/go.mp3"),
    lose : new Audio("src/TimeWaster 2/sound/lose.mp3"),
    O : new Audio("src/TimeWaster 2/sound/O.mp3"),
    pause : new Audio("src/TimeWaster 2/sound/pause.mp3"),
    unpause : new Audio("src/TimeWaster 2/sound/unpause.mp3"),
    win : new Audio("src/TimeWaster 2/sound/win.mp3"),
    X : new Audio("src/TimeWaster 2/sound/X.mp3")
};

// Main array of functions to be called depending on game context.
let gameFunctions = 
[
    titleScreen,
    gameLoop,
    instructionScreen,
    gameoverScreen,
    loadingScreen,
    winScreen,
    levelEditor
];

// Sets up event listener and starts recursive animation.
function main()
{
    window.addEventListener('keydown', handleKeyInput);

    sounds.win.addEventListener('play', () => { game.allowKeyPress = false; } )
    sounds.win.addEventListener('ended', ()=> { game.allowKeyPress = true; } );
    sounds.lose.addEventListener('play', () => { game.allowKeyPress = false; } )
    sounds.lose.addEventListener('ended', ()=> { game.allowKeyPress = true; } );

    animate();
}

// Recursive animation loop.
function animate() 
{
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Calls the appropriate function based on game context (Title screen, instructions screen, etc)
    gameFunctions[game.context]();

    requestAnimationFrame(animate);
}

// Handles all key press events, depending on context.
function handleKeyInput(event) 
{
    // Just for debugging
    // console.log(event.key);

    event.preventDefault();

    switch (game.context)
    {
        case '0': titleScreenKeyHandler(event.key); break;

        case '1': gameKeyHandler(event.key); break;

        case '2': instructionScreenKeyHandler(event.key); break;

        case '3': gameoverScreenKeyHandler(event.key); break;

        // Case 4 (loading screen) has no key handlers.
        
        case '5': winScreenKeyHandler(event.key); break;

        case '6': levelEditorKeyHandler(event.key); break;

        default: break;
    }
}

// Returns a random number in the range (inclusive)
function getRandom(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Helper method returns an entity at a random XY.
// Must specify the drawing method.
function getRandomlyPlacedEntity(drawMethod)
{
    const SIZE = 20;

    let x = getRandom(SIZE, CANVAS_SIZE - SIZE);
    let y = getRandom(SIZE, 400 - SIZE);

    return new Entity(x, y, drawMethod);
}