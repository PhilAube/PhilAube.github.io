// WEB PROGRAMMING 1 PROJECT 
// DEVELOPED BY : PHIL AUBE

// The game loading gets its own screen. Yep.
// Apparently, spawning entities that don't overlap is a lot to ask of JS.
// Either that or I'm bad at writing algorithms.
function loadingScreen() 
{
    // Ensures that the frame is displayed before loading game
    if (game.lastTimedEvent != 0)
    {
        resetGame();

        game.xArray = spawnRandomXs(game.xQty);
        game.oArray = spawnNonOverlappingOs(game.xQty, game.oQty);

        game.context = '1';
    }
    else
    {
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.strokeStyle = CYAN;
        ctx.lineWidth = 1;
        
        ctx.strokeText("SPAWNING ENTITIES...", MID_CANVAS, MID_CANVAS);
    
        game.lastTimedEvent++;
    }
}

// Returns array of X entities that don't overlap themselves.
// Drawing function needs to be specified.
function spawnRandomXs(qty) 
{   
    let array = [];
        
    for (i = 0; i < qty; i++)
    {
        do array[i] = getRandomlyPlacedEntity(drawX);
        while (array[i].isIntersecting(game.player));

        // Ensures that these entities don't overlap with anything that came first.
        for (j = 0; j < i; j++)
        {
            if (array[i].isIntersecting(array[j]))
            {
                // RESTART LOOP TO FIND NEW RANDOM XY
                i = 0;
                break;
            }
        }
    }

    return array;
}

// Returns an array of randomly positioned Os that don't overlap the Xs or themselves.
// Assumes the Xs were created first.
function spawnNonOverlappingOs(xQty, oQty) 
{
    let array = [];

    for (i = 0; i < oQty; i++)
    {
        do array[i] = getRandomlyPlacedEntity(drawO);
        while (array[i].isIntersecting(game.player));

        // Ensures that these entities don't overlap with those that came first.
        for (j = 0; j < i; j++)
        {
            if (array[i].isIntersecting(array[j]))
            {
                // RESTART LOOP TO FIND NEW RANDOM XY
                i = -1;
                break;
            }
        }

        // Keep searching if there was no issues so far.
        if (i != -1)
        {
            // Ensures that these the Os don't overlap with the Xs.
            for (j = 0; j < xQty; j++)
            {
                if (array[i].isIntersecting(game.xArray[j]))
                {
                    // RESTART LOOP TO FIND NEW RANDOM XY
                    i = -1;
                    break;
                }
            }
        }
    }

    return array;
}