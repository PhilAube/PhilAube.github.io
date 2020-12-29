// WEB PROGRAMMING 1 PROJECT 
// DEVELOPED BY : PHIL AUBE

function gameLoop()
{
    // Grace period relative to game speed
    const GRACEPERIOD = 60 / game.speed;

    let countdownOver = game.lastTimedEvent >= 180;

    // Checks both game ending conditions first
    if (game.lives > 0 && game.score < game.oQty)
    {
        if (!game.pause && countdownOver)
        {
            // MAIN GAME LOGIC
            game.player.move();
            game.player.checkWallCollision();

            if (game.xFollow) xFollowPlayer();

            handleOCollisions();

            if (game.lastTimedEvent % GRACEPERIOD != 0) game.lastTimedEvent++;
            else handleXCollisions();
        }

        // GAME DRAWING

        if (game.lastTimedEvent % GRACEPERIOD != 0 && countdownOver) game.player.draw('#550000');
        else game.player.draw();

        for (i = 0; i < game.oArray.length; i++) game.oArray[i].draw();
        for (i = 0; i < game.xArray.length; i++) game.xArray[i].draw();

        drawInfo();
    }
    else
    {
        // If the user won, send to win screen
        if (game.score === game.oQty && game.lives > 0)
        {
            game.context = '5';
            sounds.win.play();
        } 
        // Sends the user to the game over screen if lives <= 0  
        else game.context = '3';
    }
}

// Handles any key presses during the game.
// The player movement is constrained to one axis at a time.
function gameKeyHandler(key)
{
    // No controls allowed until 321 countdown is done.
    let countdownOver = game.lastTimedEvent >= 180;

    if (countdownOver)
    {
        switch (key)
        {
            case 'Escape':
                game.lives = 0;
                sounds.lose.play();
                break;
            
            case 'ArrowUp':
                if (!game.pause)
                {
                    game.player.yVelocity = -1;
                    game.player.xVelocity = 0;
                }
                break;
    
            case 'ArrowDown':
                if (!game.pause)
                {
                    game.player.yVelocity = 1;
                    game.player.xVelocity = 0;
                }
                break;
    
            case 'ArrowLeft':
                if (!game.pause)
                {
                    game.player.xVelocity = -1;
                    game.player.yVelocity = 0;
                }
                break;
    
            case 'ArrowRight':
                if (!game.pause)
                {
                    game.player.xVelocity = 1;
                    game.player.yVelocity = 0;
                }
                break;
    
            case 'Enter':
                if (game.pause)
                {
                    game.pause = false;
                    sounds.unpause.play();
                }
                else
                {
                    game.pause = true;
                    sounds.pause.play();
                }
                break;
    
            default: break;
        }
    }
}

// Displays bottom rectangle with game info (lives, score, etc).
function drawInfo() 
{
    // Fills the bottom with dark red during grace period.
    const GRACEPERIOD = 60 / game.speed;

    let countdownOver = game.lastTimedEvent >= 180;

    const line1Y = 430;
    const line2Y = 455;
    const line3Y = 480;

    // Only shows the 321 at first, then switches to game info
    if (!countdownOver) countdownTimer();
    else
    {
        if (game.lastTimedEvent % GRACEPERIOD != 0) ctx.fillStyle = '#550000';
        else ctx.fillStyle = '#111';
        
        ctx.fillRect(0, 400, CANVAS_SIZE, 100);

        displayLives();
    
        ctx.strokeStyle = CYAN;
        ctx.strokeText("SCORE : " + game.score + "/" + game.oQty, MID_CANVAS , line2Y);
        
        if (game.pause)
        {
            ctx.font = "20px Arial";
            ctx.strokeStyle = CYAN;
            ctx.strokeText("* PAUSE *", MID_CANVAS , line3Y);
        }
    }

    drawLine();

    // Local helper to print the lives in the appropriate color.
    function displayLives() 
    {
        switch (game.lives)
        {
            case 3: ctx.strokeStyle = GREEN; break;
            case 2: ctx.strokeStyle = YELLOW; break;
            case 1: ctx.strokeStyle = RED; break;
            case 0: ctx.strokeStyle = RED; break;

            default: ctx.strokeStyle = GREEN; break;
        }
    
        ctx.font = "20px Arial";
        ctx.strokeText("LIVES : " + game.lives + "/" + game.totalLives, MID_CANVAS , line1Y);
    }

    // Local helper because 7 lines of code to draw one horizontal line, wow.
    function drawLine() 
    {
        ctx.strokeStyle = MAGENTA;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 400);
        ctx.lineTo(CANVAS_SIZE, 400);
        ctx.closePath();
        ctx.stroke();
    }
}

// Does a pretty 321 countdown.
function countdownTimer() 
{
    switch (game.lastTimedEvent)
    {
        case 0: game.color = RED; sounds.countdown.play(); break;
        case 60: game.color = YELLOW; sounds.countdown.play(); break;
        case 120: game.color = GREEN; sounds.countdown.play(); break;
        case 179: game.color = GREEN; sounds.go.play(); break;
        default: break;
    }

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 400, CANVAS_SIZE, 100);

    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.strokeStyle = game.color;
    ctx.lineWidth = 2;

    if (game.lastTimedEvent < 60) ctx.strokeText("3", MID_CANVAS, 470);
    else if (game.lastTimedEvent < 120) ctx.strokeText("2", MID_CANVAS, 470);
    else if (game.lastTimedEvent < 180) ctx.strokeText("1", MID_CANVAS, 470);
    
    game.lastTimedEvent++;
}

// Resets game states, player and deletes other entities depending on level number.
function resetGame() 
{
    switch (game.levelNumber)
    {
        case 0:
        case 1:
        case 2:
        game.totalLives = 3;
        game.xFollow = false;
        game.speed = game.levelNumber + 1; 
        game.oQty = 25;
        game.xQty = 25;
        break;

        case 3: 
        case 4: 
        case 5: 
        game.totalLives = 3;
        game.speed = game.levelNumber - 2;
        game.oQty = 25;
        game.xQty = 25;
        game.xFollow = true; 
        break;

        default: break;
    }

    game.lastTimedEvent = 0;
    game.pause = false;
    game.score = 0;
    game.lives = game.totalLives;

    // RESET PLAYER
    game.player.x = MID_CANVAS;
    game.player.y = MID_CANVAS;
    game.player.xVelocity = 0;
    game.player.yVelocity = 0;

    // RESET Xs AND Os
    while (game.xArray.length > 0) game.xArray.pop();
    while (game.oArray.length > 0) game.oArray.pop();
}

// Increments points and removes O from array when player makes contact.
function handleOCollisions() 
{
    for (i = 0; i < game.oArray.length; i++)
    {
        if (game.player.isIntersecting(game.oArray[i]))
        {
            game.oArray.splice(i, 1);
            game.score++;

            if (game.score < game.oQty)
            {
                if (sounds.O.currentTime > 0) 
                {
                    sounds.O.currentTime = 0;
                    sounds.O.play();
                }
                else sounds.O.play(); 
            } 
        }
    }    
}

// Decrements lives, and starts a second-long grace period when player makes contact.
function handleXCollisions() 
{
    for (i = 0; i < game.xArray.length; i++)
    {
        if (game.player.isIntersecting(game.xArray[i]))
        {
            game.lives--;
            // This will turn off the X collision detection temporarily
            game.lastTimedEvent++;

            if (game.lives > 0)
            {
                if (sounds.X.currentTime > 0) 
                {
                    sounds.X.currentTime = 0;
                    sounds.X.play();
                }
                else sounds.X.play(); 
            } 
            else sounds.lose.play();
        }
    }    
}

// Makes all X entities follow the player.
// Ensures no overlap.
function xFollowPlayer() 
{
    // Follow player's xy coordinates
    for (i = 0; i < game.xQty; i++)
    {
        let oldX = game.xArray[i].x;
        let oldY = game.xArray[i].y;

        game.xArray[i].followPlayer();

        // Checks if it's intersecting with another X, moves it back if so.
        for (j = 0; j < game.xQty; j++)
        {
            if (i != j)
            {
                if (game.xArray[i].isIntersecting(game.xArray[j]))
                {
                    // Put it back where it was
                    game.xArray[i].x = oldX;
                    game.xArray[i].y = oldY;
                }
            }
        }

        // Check if intersecting with O, do same thing.
        for (j = 0; j < game.oArray.length; j++)
        {
            if (game.xArray[i].isIntersecting(game.oArray[j]))
            {
                // Put it back where it was
                game.xArray[i].x = oldX;
                game.xArray[i].y = oldY;
            }
        }
    }
}