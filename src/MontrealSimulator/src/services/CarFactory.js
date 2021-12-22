import Car from "../entities/Car.js";
import CarType from "../enums/CarType.js";
import CarSelectState from "../states/CarSelectState.js";

export default class CarFactory
{
    // Returns a list of all cars in the middle of the screen.
    static getAll()
    {
        let arr = [];

        for (const [name, num] of Object.entries(CarType))
        {
            arr.push(new Car({x: CarSelectState.CAR_X, y: CarSelectState.CAR_Y}, num));
        }

        return arr;
    }

    static getPlayableCars()
    {
        return CarFactory.getAll().slice(CarType.BlueSedan, CarType.Amberlamps);
    }

    // Unlocks cars based on level.
    static getCarsBasedOnLevel(level)
    {
        const CARS_PER_TYPE = 5;

        let cars = CarFactory.getPlayableCars();
        
        let carAmount = Math.min(cars.length, CARS_PER_TYPE * level);

        for (let i = 0; i < carAmount; i++)
        {
            cars[i].isLocked = false;
        }

        return cars;
    }
}