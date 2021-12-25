import { DEBUG, timer } from "../globals.js";
import MessageBox from "../objects/MessageBox.js";

export default class Gamepad
{
    static SELECT = 8;
    static START = 9;
    static SPACE = 10;
    static UP = 12;
    static DOWN = 13;
    static LEFT = 14;
    static RIGHT = 15;

    static X = 0;
    static O = 1;
    static L = 4;
    static R = 5;

    constructor()
    {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.start = false;
        this.select = false;
        this.space = false;

        this.X = false;
        this.O = false;
        this.L = false;
        this.R = false;

        this.axis = 0;

        this.notificationBox = new MessageBox("Controller connected");
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
            this.handleRight(currentPad);
            this.handleSelect(currentPad);     
            this.handleStart(currentPad);
            this.handleSpace(currentPad);

            this.handleX(currentPad);
            this.handleO(currentPad);
            this.handleL(currentPad);
            this.handleR(currentPad);

            this.handleAxis(currentPad);
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

    handleStart(currentPad)
    {
        if (currentPad.buttons[Gamepad.START].pressed)
        {
            if (!this.start)
            {
                this.start = true;
                if (DEBUG)
                {
                    console.log("START Button Pressed");
                    console.log(currentPad);
                }
            } 
        }
        else if (this.start)
        {
            this.start = false;

            if (DEBUG)
            {
                console.log("START Button Released");
                console.log(currentPad);
            }
        } 
    }

    handleSelect(currentPad)
    {
        if (currentPad.buttons[Gamepad.SELECT].pressed)
        {
            if (!this.select)
            {
                this.select = true;
                if (DEBUG)
                {
                    console.log("SELECT Button Pressed");
                    console.log(currentPad);
                }
            } 
        }
        else if (this.select)
        {
            this.select = false;

            if (DEBUG)
            {
                console.log("SELECT Button Released");
                console.log(currentPad);
            }
        } 
    }

    handleSpace(currentPad)
    {
        if (currentPad.buttons[Gamepad.SPACE].pressed)
        {
            if (!this.space)
            {
                this.space = true;
                if (DEBUG)
                {
                    console.log("SPACE Button Pressed");
                    console.log(currentPad);
                }
            } 
        }
        else if (this.space)
        {
            this.space = false;

            if (DEBUG)
            {
                console.log("SPACE Button Released");
                console.log(currentPad);
            }
        } 
    }

    handleL(currentPad)
    {
        if (currentPad.buttons[Gamepad.L].pressed)
        {
            if (!this.L)
            {
                this.L = true;
                if (DEBUG)
                {
                    console.log("L Button Pressed");
                    console.log(currentPad);
                }
            } 
        }
        else if (this.L)
        {
            this.L = false;

            if (DEBUG)
            {
                console.log("L Button Released");
                console.log(currentPad);
            }
        } 
    }

    handleR(currentPad)
    {
        if (currentPad.buttons[Gamepad.R].pressed)
        {
            if (!this.R)
            {
                this.R = true;
                if (DEBUG)
                {
                    console.log("R Button Pressed");
                    console.log(currentPad);
                }
            } 
        }
        else if (this.R)
        {
            this.R = false;

            if (DEBUG)
            {
                console.log("R Button Released");
                console.log(currentPad);
            }
        } 
    }

    handleX(currentPad)
    {
        if (currentPad.buttons[Gamepad.X].pressed)
        {
            if (!this.X)
            {
                this.X = true;
                if (DEBUG)
                {
                    console.log("X Button Pressed");
                    console.log(currentPad);
                }
            } 
        }
        else if (this.X)
        {
            this.X = false;

            if (DEBUG)
            {
                console.log("X Button Released");
                console.log(currentPad);
            }
        } 
    }

    handleO(currentPad)
    {
        if (currentPad.buttons[Gamepad.O].pressed)
        {
            if (!this.O)
            {
                this.O = true;
                if (DEBUG)
                {
                    console.log("O Button Pressed");
                    console.log(currentPad);
                }
            } 
        }
        else if (this.O)
        {
            this.O = false;

            if (DEBUG)
            {
                console.log("O Button Released");
                console.log(currentPad);
            }
        } 
    }

    handleAxis(currentPad)
    {
        const VERTICAL_AXIS = 1;
        const THRESHOLD = 0.1;

        let value = currentPad.axes[VERTICAL_AXIS];

        // Value should be 0 between a small threshold.
        // In case your crappy controller isn't perfect.
        if (value < THRESHOLD && value > -THRESHOLD) this.axis = 0;
        else this.axis = value;
    }

    coalesce(arr) 
    {
        for (let i = 0; i < arr.length; i++) 
        {
          if (arr[i] != null) return arr[i];
        }
    }

    checkIfButtonsPressed()
    {
        let values = Object.values(this);
        values.pop(); // MessageBox
        return !values.every((v) => v == false);
    }

    notifyUser(connected)
    {
        const WAIT_TIME = 2;
        
        if (connected) this.notificationBox.text = "Controller connected";
        else this.notificationBox.text = "Controller disconnected";
        
        this.notificationBox.isTweening = true;

        timer.tween(this.notificationBox.position, ['y'], [MessageBox.POS_Y], 0.5, () =>
        {
            timer.wait(WAIT_TIME, () =>
            {
                timer.tween(this.notificationBox.position, ['y'], [MessageBox.OFFSCREEN_Y], 0.5, 
                () => { this.notificationBox.isTweening = false; });
            });
        });
    }
}