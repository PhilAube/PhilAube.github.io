import State from "../../lib/State.js";
import FontName from "../enums/FontName.js";
import SoundName from "../enums/SoundName.js";
import GameStateName from "../enums/GameStateName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, keys, sounds, stateMachine, settings, timer } from "../globals.js";
import CarFactory from "../services/CarFactory.js";
import StatsPanel from "../objects/StatsPanel.js";
import Car from "../entities/Car.js";
import Player from "../entities/Player.js";
import Level from "../objects/Level.js";
import Lock from "../objects/Lock.js";

export default class CarSelectState extends State {
    static HEADER_Y = 100;
    static HEADER_TEXT_SIZE = 50;
	static STATS_POSITION = { x: 200, y: 350 };

	static CAR_X = CANVAS_WIDTH / 2 - (Car.WIDTH / 2);
    static CAR_Y = 150;

	constructor() 
	{
		super();

		this.cars = [];
		this.selectedCar = Number;
		this.statsPanel = new StatsPanel({ x: CarSelectState.STATS_POSITION.x, y: CarSelectState.STATS_POSITION.y });
		this.isTweening = false;
		this.alpha = 0; // Alpha of the black for transition
		this.lock = new Lock();
	}

	enter()
	{
		settings.checkCorruption(); // Refresh settings to check for corruption

		this.selectedCar = 0;
		this.cars = CarFactory.getCarsBasedOnLevel(settings.currentLevel);
		this.cars[this.selectedCar].animation.currentFrame = 0;
		this.cars[this.selectedCar].currentFrame = 0;
		this.statsPanel.car = this.cars[this.selectedCar];

		this.alpha = 1;

		this.isTweening = true;

		timer.tween(this, ['alpha'], [0], 1, () =>
		{
			this.isTweening = false;
		});
	}

	update(dt)
	{
		this.cars[this.selectedCar].update(dt);
		timer.update(dt);

		// No input allowed while swapping cars
		if (!this.isTweening) this.handleInput();
	}

	render()
	{
		const ARROWS = "<          >";
		
		context.fillStyle = 'black';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		context.textAlign = 'center';
        context.fillStyle = 'white';
		context.font = `${CarSelectState.HEADER_TEXT_SIZE}px ${FontName.Joystix}`;
		context.fillText("SELECT YOUR CAR", CANVAS_WIDTH / 2, CarSelectState.HEADER_Y);

        this.cars[this.selectedCar].render();
		this.statsPanel.render();

		if (!this.isTweening)
		{
			context.font = `${CarSelectState.HEADER_TEXT_SIZE}px ${FontName.Joystix}`;
			context.fillText(ARROWS, CANVAS_WIDTH / 2, CarSelectState.CAR_Y + 100);

			if (this.cars[this.selectedCar].isLocked) this.lock.render();
		} 

		context.save();
		context.globalAlpha = this.alpha;
		context.fillStyle = 'black';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.restore();
	}

	tweenCarAndPanelLeft()
	{
		const SWAP_DISTANCE = 800;
		const SWAP_TIME = 0.25;

		let endCar = this.cars[this.selectedCar].position.x + SWAP_DISTANCE;
		let endPanel = this.statsPanel.position.x + SWAP_DISTANCE;

		this.isTweening = true;

		// Bring current car to the left
		timer.tween(this.cars[this.selectedCar].position, ['x'], [endCar], SWAP_TIME, () =>
		{
			// Reset animation and position
			this.cars[this.selectedCar].position.x = CarSelectState.CAR_X;
			this.cars[this.selectedCar].animation.currentFrame = 0;
			this.cars[this.selectedCar].currentFrame = 0;

			// Change the car in memory
			this.selectedCar = this.selectedCar === 0 ? this.cars.length - 1 : this.selectedCar - 1;
			this.statsPanel.car = this.cars[this.selectedCar];
			
			// Bring next car from the right
			this.cars[this.selectedCar].position.x -= SWAP_DISTANCE;
			timer.tween(this.cars[this.selectedCar].position, ['x'], [CarSelectState.CAR_X], SWAP_TIME);
		});

		// Bring current panel to the left
		timer.tween(this.statsPanel.position, ['x'], [endPanel], SWAP_TIME, () => 
		{
			this.statsPanel.position.x = CarSelectState.STATS_POSITION.x - SWAP_DISTANCE;
			timer.tween(this.statsPanel.position, ['x'], [CarSelectState.STATS_POSITION.x], SWAP_TIME,
			() => { this.isTweening = false; });
		});
	}

	tweenCarAndPanelRight()
	{
		const SWAP_DISTANCE = 800;
		const SWAP_TIME = 0.25;

		let endCar = this.cars[this.selectedCar].position.x - SWAP_DISTANCE;
		let endPanel = this.statsPanel.position.x - SWAP_DISTANCE;

		this.isTweening = true;

		// Bring current car to the right
		timer.tween(this.cars[this.selectedCar].position, ['x'], [endCar], SWAP_TIME, () =>
		{
			// Reset animation and position
			this.cars[this.selectedCar].position.x = CarSelectState.CAR_X;
			this.cars[this.selectedCar].animation.currentFrame = 0;
			this.cars[this.selectedCar].currentFrame = 0;
			
			// Change the car in memory
			this.selectedCar++;
			this.selectedCar = this.selectedCar % this.cars.length;
			this.statsPanel.car = this.cars[this.selectedCar];

			// Bring next car from the left
			this.cars[this.selectedCar].position.x += SWAP_DISTANCE;
			timer.tween(this.cars[this.selectedCar].position, ['x'], [CarSelectState.CAR_X], SWAP_TIME);
		});

		// Bring current panel to the right
		timer.tween(this.statsPanel.position, ['x'], [endPanel], SWAP_TIME, () => 
		{
			this.statsPanel.position.x = CarSelectState.STATS_POSITION.x + SWAP_DISTANCE;
			timer.tween(this.statsPanel.position, ['x'], [CarSelectState.STATS_POSITION.x], SWAP_TIME, 
			() => { this.isTweening = false; });
		});
	}

	handleInput()
	{
		if (keys.ArrowLeft)
		{
			if (!settings.muteSound) sounds.play(SoundName.Select);
			keys.ArrowLeft = false;
			this.tweenCarAndPanelLeft();
		}
		else if (keys.ArrowRight)
		{
			if (!settings.muteSound) sounds.play(SoundName.Select);
			keys.ArrowRight = false;
			this.tweenCarAndPanelRight();
		}
		else if (keys.Enter)
		{
			if (this.cars[this.selectedCar].isLocked) 
			{
				keys.Enter = false;
				if (!settings.muteSound) sounds.play(SoundName.Nope);
			}
			else
			{
				if (!settings.muteMusic) sounds.stop(SoundName.MenuMusic);
				if (!settings.muteSound) sounds.play(SoundName.Poutine);
				keys.Enter = false;

				this.isTweening = true;

				timer.tween(this, ['alpha'], [1], 1, () =>
				{
					this.alpha = 0;

					let newPlayer = new Player(this.cars[this.selectedCar].type);
					let newLevel = new Level(newPlayer, settings.currentLevel);

					stateMachine.change(GameStateName.Play, 
					{
						player: newPlayer, 
						level: newLevel,
						fade: true
					});
				});
			}
		}
	}
}
