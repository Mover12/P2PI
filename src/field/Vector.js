export default class Vector {
    x;y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    stringify() {
        return `${this.x},${this.y}`
    }
}