// WEB PROGRAMMING 1 PROJECT 
// DEVELOPED BY : PHIL AUBE

function instructionScreen() 
{
    const line1Y = (CANVAS_SIZE / 10) * 8;
    const line2Y = (CANVAS_SIZE / 10) * 9;

    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 2;
    ctx.strokeText("INSTRUCTIONS", MID_CANVAS, CANVAS_SIZE / 6);

    ctx.font = "15px Arial";
    ctx.fillStyle = MAGENTA;

    // Changes depending on which page the user is on.
    showPage[game.levelNumber]();

    ctx.fillStyle = CYAN;
    ctx.fillText("PRESS LEFT OR RIGHT TO SEE NEXT/PREVIOUS PAGES.", MID_CANVAS , line1Y);
    ctx.fillText("PRESS ESCAPE TO RETURN TO THE TITLE SCREEN.", MID_CANVAS , line2Y);
}

// Handles any key presses on instruction screen.
function instructionScreenKeyHandler(key) 
{
    switch (key)
    {
        case "Escape":
            game.context = '0';
            game.levelNumber = 0;
            break;
        
        case "ArrowLeft":
            if (game.levelNumber > 0) game.levelNumber--;
            break;

        case "ArrowRight":
            if (game.levelNumber < showPage.length - 1) game.levelNumber++;
            break;
    }
}

// The array of functions for each instruction page.
let showPage = 
[
    () => 
    {
        // PAGE 1
        const line1Y = 125;
        const line2Y = 200;
        const line3Y = 275;
        const line4Y = 300;
        const line5Y = 325;

        ctx.fillText("PAGE 1/" + showPage.length, MID_CANVAS , line1Y);
        ctx.fillText("Let's get one thing straight here:", MID_CANVAS , line2Y);
        ctx.fillText("TIMEWASTER: NOUN", MID_CANVAS , line3Y);
        ctx.fillText("1. Someone who wastes their own or others' time.", MID_CANVAS , line4Y);
        ctx.fillText("2. Something unproductive.", MID_CANVAS , line5Y);
    },
    () =>
    {
        // PAGE 2
        const line1Y = 125;
        const line2Y = 175;
        const line3Y = 200;
        const line4Y = 250;
        const line5Y = 290;
        const line6Y = 310;
        const line7Y = 350;

        ctx.fillText("PAGE 2/" + showPage.length, MID_CANVAS , line1Y);
        ctx.fillText("So who is the time waster anyway - is it you, or the game?", MID_CANVAS , line2Y);
        ctx.fillText("You know what? I've already wasted enough time.", MID_CANVAS , line3Y);
        ctx.fillText("The game is pretty simple.", MID_CANVAS , line4Y);
        
        ctx.fillStyle = GREEN;
        ctx.fillText("GREEN O GOOD", MID_CANVAS , line5Y);
        ctx.fillStyle = RED;
        ctx.fillText("RED X BAD", MID_CANVAS , line6Y);
        
        ctx.fillStyle = MAGENTA;
        ctx.fillText("If you're color blind, I'm sorry.", MID_CANVAS , line7Y);
    },
    () =>
    {
        // PAGE 3
        const line1Y = 125;
        const line2Y = 175;
        const line3Y = 200;
        const line4Y = 225;
        const line5Y = 300;
        const line6Y = 325;
        const line7Y = 350;

        ctx.fillText("PAGE 3/" + showPage.length, MID_CANVAS , line1Y);
        ctx.fillText("Your character is the square. It should stand out from the rest.", MID_CANVAS , line2Y);
        ctx.fillText("The point of the game is to collect every green O.", MID_CANVAS , line3Y);
        ctx.fillText("Oh, and avoid any red X. Whatever they're supposed to be.", MID_CANVAS , line4Y);
        ctx.fillText("Use the ARROW KEYS to move your character around.", MID_CANVAS , line5Y);
        ctx.fillText("Press ENTER to pause the game.", MID_CANVAS , line6Y);
        ctx.fillText("Press ESCAPE to kill yourself with dignity.", MID_CANVAS , line7Y);
    }
];