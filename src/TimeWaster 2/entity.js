// WEB PROGRAMMING 1 PROJECT 
// DEVELOPED BY : PHIL AUBE

// An entity is any sprite that can move on the canvas.
// All sprites have square hit boxes.
class Entity
{
    constructor(x, y, draw)
    {
        this.x = x;
        this.y = y;
        this.xVelocity = 0;
        this.yVelocity = 0;

        this.draw = draw;

        // Modifies the sprite's coordinates according to game speed.
        this.move = function()
        {
            this.x += this.xVelocity * game.speed;
            this.y += this.yVelocity * game.speed;
        }

        // Assumes the passed object has x property.
        // (Doesn't have to be an entity object)
        this.isXIntersecting = function(entity)
        {
            const SIZE = 20;

            // Left
            if (this.x + (SIZE/2) < entity.x) return false;

            // Right
            else if (this.x - (SIZE/2) > entity.x) return false;

            else return true;
        }

        // Assumes the passed object has y property.
        // (Doesn't have to be an entity object)
        this.isYIntersecting = function(entity)
        {
            const SIZE = 20;

            // Top
            if (this.y + (SIZE/2) < entity.y) return false;

            // Bottom
            else if (this.y - (SIZE/2) > entity.y) return false;

            else return true;
        }

        // Returns true if the entity intersects another entity.
        // (Should have x and y)
        this.isIntersecting = function(entity) 
        {
            const SIZE = 20;

            // Left
            if (this.x + SIZE < entity.x - 1) return false;
            // Right
            else if (this.x - SIZE > entity.x + 1) return false;
            // Top
            else if (this.y + SIZE < entity.y - 1) return false;
            // Bottom
            else if (this.y - SIZE > entity.y + 1) return false;

            else return true;
        }

        // Stops the entity when it touches canvas walls.
        this.checkWallCollision = function()
        {
            const bottomBorder = { y : 400 };
            const topBorder = { y : 0 };
            const leftBorder = { x : 0 };
            const rightBorder = { x : CANVAS_SIZE };

            if (this.isYIntersecting(bottomBorder))
            {
                do this.y--; 
                while (this.isYIntersecting(bottomBorder));
                this.yVelocity = 0;
            }

            else if (this.isYIntersecting(topBorder))
            {
                do this.y++; 
                while (this.isYIntersecting(topBorder));
                this.yVelocity = 0;
            }

            else if (this.isXIntersecting(leftBorder))
            {
                do this.x++; 
                while ((this.isXIntersecting(leftBorder)));
                this.xVelocity = 0;
            }

            else if (this.isXIntersecting(rightBorder))
            {
                do this.x--; 
                while (this.isXIntersecting(rightBorder));
                this.xVelocity = 0;
            }
        }

        // Modifies the entity coordinates to approach the player.
        this.followPlayer = function() 
        {
            let followSpeed = 0.3;

            // CALCULATE X AND Y PROXIMITY
            let xProximity = Math.abs(this.x - game.player.x);
            let yProximity = Math.abs(this.y - game.player.y);

            // Moves diagonally if x and y proximity are the same
            if (xProximity === yProximity)
            {
                if (this.x > game.player.x) this.x -= followSpeed * game.speed;
                else if (this.x < game.player.x) this.x += followSpeed * game.speed;
                
                if (this.y > game.player.y) this.y -= followSpeed * game.speed;
                else if (this.y < game.player.y) this.y += followSpeed * game.speed;
            }
            // Otherwise, approaches player via the quickest axis.
            else if (xProximity < yProximity)
            {
                if (this.y > game.player.y) this.y -= followSpeed * game.speed;
                else if (this.y < game.player.y) this.y += followSpeed * game.speed;
            }
            else if (yProximity < xProximity)
            {
                if (this.x > game.player.x) this.x -= followSpeed * game.speed;
                else if (this.x < game.player.x) this.x += followSpeed * game.speed;
            }
        }
    }
}

// Draw player character.
function drawSquare(color = CYAN)
{
    const SIZE = 20;

    ctx.fillStyle = color;

    ctx.fillRect(this.x - (SIZE/2), this.y - (SIZE/2), SIZE, SIZE);
}

// Draw bad thing.
function drawX() 
{
    const SIZE = 20;

    ctx.strokeStyle = RED;

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(this.x - (SIZE/2), this.y - (SIZE/2));
    ctx.lineTo(this.x + SIZE - (SIZE/2), this.y + SIZE - (SIZE/2))
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.x + SIZE - (SIZE/2), this.y - (SIZE/2));
    ctx.lineTo(this.x - (SIZE/2), this.y + SIZE - (SIZE/2))
    ctx.closePath();
    ctx.stroke();

    // Draw hit box around X (for debugging)
    // ctx.strokeRect(this.x - (SIZE/2), this.y - (SIZE/2), SIZE, SIZE);
}

// Draw good thing.
function drawO() 
{
    const RADIUS = 10;

    ctx.strokeStyle = GREEN;

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.arc(this.x, this.y, RADIUS, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();

    // Draw hit box around circle (for debugging)
    // ctx.strokeRect(this.x - RADIUS, this.y - RADIUS, RADIUS * 2, RADIUS * 2);
}