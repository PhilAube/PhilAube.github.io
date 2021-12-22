export default class GameEntity
{
    constructor(position) 
    {
        this.position = position;
        this.velocity = { x: 0, y: 0 };
        this.sprites = [];
        this.shouldCleanUp = false;
    }

    update(dt) { }

    render() { }
}