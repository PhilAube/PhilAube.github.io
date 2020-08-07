// * This class defines a rectangular or circular canvas object that is clickable/hoverable. * //

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