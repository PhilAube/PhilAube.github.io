/** Represents a selectable option in a Menu system. */
export default class MenuOption {
    /**
     * @param {String} name The enum value of the menu option name.
     * @param {Function} task The task to be executed when selecting this option.
     * @param {Vector} position The offset where the option is displayed relative to the Menu's CanvasObject.
     */
    constructor(id, task, position) {
        this.id = id;
        this.task = task;
        this.position = position;
    }
}