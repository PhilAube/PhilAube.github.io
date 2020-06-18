let isPressed = false;

window.addEventListener("resize", burgerResize);

// If the user clicks the burger
function burgerClick()
{
    let items = document.getElementsByClassName("navitem");
    
    isPressed = !isPressed;

    if (isPressed)
    {
        for (let i = 0; i < 3; i++)
        {   
            items[i].style.display = "block";
        }
    }
    else
    {
        for (let i = 0; i < 3; i++)
        {   
            items[i].style.display = "none";
        }
    }
}

// If the user resizes the window after open/close burger menu
function burgerResize()
{
    let items = document.getElementsByClassName("navitem");

    if (window.innerWidth > 500 && !isPressed)
    {
        for (let i = 0; i < 3; i++)
        {   
            items[i].style.display = "block";
        }
    }
    else if (window.innerWidth <= 500 && !isPressed)
    {
        for (let i = 0; i < 3; i++)
        {   
            items[i].style.display = "none";
        }
    }
}

// Changes color on hover
function change(x)
{
    x.style.opacity = 0.5;
}

// Reverts the color back off hover
function revert(x)
{
    x.style.opacity = 1;
}