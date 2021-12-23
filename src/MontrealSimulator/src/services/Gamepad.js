import { DEBUG } from "../globals.js";

export default class Gamepad
{
    static ENTER = 9;
    static UP = 12;
    static DOWN = 13;
    static LEFT = 14;
    static RIGHT = 15;

    constructor()
    {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.enter = false;
        this.space = false;
    }

    getCurrentState()
    {
        let gamepadState = navigator.getGamepads();

        let gamepads = Object.values(gamepadState)

        if (gamepads.every(x => x === null)) return;
        else
        {
            let currentPad = this.coalesce(gamepads);

            this.handleUp(currentPad);
            this.handleDown(currentPad);
            this.handleLeft(currentPad);
            this.handleRight(currentPad)          
            this.handleEnter(currentPad);
        }

        return this;
    }

    handleUp(currentPad)
    {
        if (currentPad.buttons[Gamepad.UP].pressed)
        {
            if (!this.up)
            {
                this.up = true;
                if (DEBUG)
                {
                    console.log("UP Button Pressed");
                    console.log(currentPad);
                }
            } 
        }
        else if (this.up)
        {
            this.up = false;

            if (DEBUG)
            {
                console.log("UP Button Released");
                console.log(currentPad);
            }
        } 
    }

    handleDown(currentPad)
    {
        if (currentPad.buttons[Gamepad.DOWN].pressed)
        {
            if (!this.down)
            {
                this.down = true;
                if (DEBUG)
                {
                    console.log("DOWN Button Pressed");
                    console.log(currentPad);
                }
            } 
        }
        else if (this.down)
        {
            this.down = false;

            if (DEBUG)
            {
                console.log("DOWN Button Released");
                console.log(currentPad);
            }
        } 
    }

    handleLeft(currentPad)
    {
        if (currentPad.buttons[Gamepad.LEFT].pressed)
        {
            if (!this.left)
            {
                this.left = true;
                if (DEBUG)
                {
                    console.log("LEFT Button Pressed");
                    console.log(currentPad);
                }
            } 
        }
        else if (this.left)
        {
            this.left = false;

            if (DEBUG)
            {
                console.log("LEFT Button Released");
                console.log(currentPad);
            }
        } 
    }

    handleRight(currentPad)
    {
        if (currentPad.buttons[Gamepad.RIGHT].pressed)
        {
            if (!this.right)
            {
                this.right = true;
                if (DEBUG)
                {
                    console.log("RIGHT Button Pressed");
                    console.log(currentPad);
                }
            } 
        }
        else if (this.right)
        {
            this.right = false;

            if (DEBUG)
            {
                console.log("RIGHT Button Released");
                console.log(currentPad);
            }
        } 
    }

    handleEnter(currentPad)
    {
        if (currentPad.buttons[Gamepad.ENTER].pressed)
        {
            if (!this.enter)
            {
                this.enter = true;
                if (DEBUG)
                {
                    console.log("START Button Pressed");
                    console.log(currentPad);
                }
            } 
        }
        else if (this.enter)
        {
            this.enter = false;

            if (DEBUG)
            {
                console.log("START Button Released");
                console.log(currentPad);
            }
        } 
    }

    coalesce(arr) 
    {
        for (let i = 0; i < arr.length; i++) 
        {
          if (arr[i] != null) return arr[i];
        }
    }
}