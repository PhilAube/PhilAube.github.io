let CANVAS_SIZE = 400;

function setup() 
{
    var canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    canvas.parent('stickmanCanvas');

    myCanvas = document.getElementsByTagName("canvas")[0];
    myCanvas.style.width = "100%";
    myCanvas.style.height = "100%";
    
    reset();
}

function draw() 
{
    // This `if` will run these drawings once upon starting the program.
    if (frameCount == 1) 
    {
        circles();
        // Draw a single stickman with its head on the center of the canvas
        translate(width/2, height/2);
        stickman();
        translate(-width/2, -height/2);
    }
}

function mouseClicked() 
{
    clickman();
}

function randomColor() 
{
    let r = getRandomInRange(0, 255);
    let g = getRandomInRange(0, 255);
    let b = getRandomInRange(0, 255);

    return color(r, g, b);
}

function circles() 
{
    const NUM_CIRCLES = 20;
    const MIN_DIAMETER = 20;
    const MAX_DIAMETER = 40;

    noStroke();

    for (let i = 0; i < NUM_CIRCLES; i++) 
    {
        fill(randomColor())
    
        let d = getRandomInRange(MIN_DIAMETER, MAX_DIAMETER);
        let x = getRandomInRange(d/2, CANVAS_SIZE - d/2);
        let y = getRandomInRange(d/2, CANVAS_SIZE - d/2);
    
        ellipse(x, y, d);
    }

    stroke(0, 0, 0);
}

function getRandomInRange(min, max)
{
    return Math.floor( Math.random() * (max - min) + min );
}

function stickman() 
{
      // Head and Body
      fill(randomColor());
      strokeWeight(5);
      stroke(0, 0, 0);
      circle(0, 0, 50);
      line(0, 25, 0, 75);
      line(0, 25, -25, 50);
      line(0, 25, 25, 50);
      line(0, 75, -25, 100);
      line(0, 75, 25, 100);
  
      // Face
      stroke(255, 255, 255);
      fill(255, 255, 255);
      line(-5, -10, -5, 0);
      line(5, -10, 5, 0);
      line(-5, 10, 5, 10);
      arc(0, 10, 10, 10, 0, PI);
  
      // Reset defaults for future drawings
      strokeWeight(1);
      stroke(0, 0, 0);
}

function clickman() 
{
    // If mouse is within canvas limits
    if (mouseY < CANVAS_SIZE & mouseY > 0 & mouseX < CANVAS_SIZE & mouseX > 0)
    {
        // Move into position and rotation
        translate(mouseX, mouseY);
        rotate(getRandomInRange(0, (Math.PI*2)));
  
        // Draw the stickman at new position/rotation
        stickman();
  
        // Reset modifications of position/rotation back to default for any future drawings
        resetMatrix();
    }
}

function reset()
{
    fill(225, 225, 225);
    rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    noFill();
}