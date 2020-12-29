// WEB PROGRAMMING 1 PROJECT 
// DEVELOPED BY : PHIL AUBE

function levelEditor() 
{
    const line1Y = (CANVAS_SIZE / 10) * 3.5;
    const line2Y = (CANVAS_SIZE / 10) * 5;
    const line3Y = (CANVAS_SIZE / 10) * 6.5;
    const line4Y = (CANVAS_SIZE / 10) * 7.5;
    const line5Y = (CANVAS_SIZE / 10) * 8.5;

    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.strokeStyle = CYAN;

    switch (game.levelNumber)
    {
        case 0:
            ctx.strokeText("SELECT YOUR DESIRED X QUANTITY", MID_CANVAS, line1Y);
            ctx.strokeText(game.xQty, MID_CANVAS, line2Y);
            break;
        
        case 1:
            ctx.strokeText("SELECT YOUR DESIRED O QUANTITY", MID_CANVAS, line1Y);
            ctx.strokeText(game.oQty, MID_CANVAS, line2Y);
            break;

        case 2:
            ctx.strokeText("SELECT THE AMOUNT OF LIVES YOU WANT", MID_CANVAS, line1Y);
            ctx.strokeText(game.totalLives, MID_CANVAS, line2Y);;
            break;
        
        case 3:
            ctx.strokeText("DO YOU WANT TO GET GANGED UP ON?", MID_CANVAS, line1Y);
            if (game.xFollow) ctx.strokeText("YES", MID_CANVAS, line2Y); 
            else ctx.strokeText("NO", MID_CANVAS, line2Y);
            break;

        case 4:
            ctx.strokeText("SELECT THE GAME SPEED", MID_CANVAS, line1Y);
            ctx.strokeText(game.speed, MID_CANVAS, line2Y);
            break;
    }

    ctx.strokeText("USE LEFT/RIGHT ARROWS TO CYCLE", MID_CANVAS, line3Y);
    ctx.strokeText("PRESS ENTER TO CHOOSE", MID_CANVAS, line4Y);
    ctx.strokeText("PRESS ESCAPE TO RETURN TO MENU", MID_CANVAS, line5Y);
}

// Handles any key presses on level editor screen.
function levelEditorKeyHandler(key) 
{
    // Level numbers are the page numbers in this case
    switch (game.levelNumber)
    {
        // SELECT X QUANTITY
        case 0:
            switch (key)
            {
                case "Escape":
                    game.context = '0';
                    resetLevelEditor();
                    break;
                
                case "ArrowLeft":
                    if (game.xQty > 1) game.xQty--;
                    break;
        
                case "ArrowRight":
                    if (game.xQty < MAX_X_ENTITIES) game.xQty++;
                    break;

                case "Enter":
                    game.levelNumber++;
                    break;
            }
            break;
        
        // SELECT O QUANTITY
        case 1:
            switch (key)
            {
                case "Escape":
                    game.context = '0';
                    resetLevelEditor();
                    break;
                
                case "ArrowLeft":
                    if (game.oQty > 1) game.oQty--;
                    break;
        
                case "ArrowRight":
                    if (game.oQty < MAX_X_ENTITIES) game.oQty++;
                    break;

                case "Enter":
                    game.levelNumber++;
                    break;
            }
            break;

        // SELECT LIVES QUANTITY
        case 2:
            const MAX_LIVES = 100;
            switch (key)
            {
                case "Escape":
                    game.context = '0';
                    resetLevelEditor();
                    break;
                
                case "ArrowLeft":
                    if (game.totalLives > 1) game.totalLives--;
                    break;
        
                case "ArrowRight":
                    if (game.totalLives < MAX_LIVES) game.totalLives++;
                    break;

                case "Enter":
                    game.levelNumber++;
                    break;
            }
            break;
        
        // SELECT X FOLLOW
        case 3:
            switch (key)
            {
                case "Escape":
                    game.context = '0';
                    resetLevelEditor();
                    break;
                
                case "ArrowLeft":
                    game.xFollow = false;
                    break;

                case "ArrowRight":
                    game.xFollow = true;
                    break;

                case "Enter":
                    game.levelNumber++;
                    break;
            }
            break;

        // SELECT SPEED
        case 4:
            const MAX_SPEED = 5;
            switch (key)
            {
                case "Escape":
                    game.context = '0';
                    resetLevelEditor();
                    break;
                
                case "ArrowLeft":
                    if (game.speed > 1) game.speed--;
                    break;

                case "ArrowRight":
                    if (game.speed < MAX_SPEED) game.speed++;
                    break;

                case "Enter":
                    game.levelNumber = 420;
                    // Loading screen
                    game.context = '4';
                    break;
            }
    }
}

// Resets all level editor states back to their default state.
function resetLevelEditor() 
{
    game.xFollow = false;
    game.xQty = 1;
    game.oQty = 1;
    game.totalLives = 1;
    game.lastTimedEvent = 0;
    game.levelNumber = 0;
    game.speed = 1;
}