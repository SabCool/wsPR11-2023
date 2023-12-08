const utils = require("./functions.js");
const LivingCreature = require("./livingCreature.js");
module.exports = class Grazer extends LivingCreature{
    constructor(x, y) {
        super(x,y)
        // Farbe - yellow
        this.colorValue = 2;
        this.eatCount = 0;
        this.notEaten = 0;
    }

    updateNeighbors() {
        this.neighbors = [
            [this.x - 1, this.y - 1],
            [this.x, this.y - 1],
            [this.x + 1, this.y - 1],
            [this.x - 1, this.y],
            [this.x + 1, this.y],
            [this.x - 1, this.y + 1],
            [this.x, this.y + 1],
            [this.x + 1, this.y + 1]
        ];
    }

    findFields(symbol) {
        this.updateNeighbors();
        return super.findFields(symbol)
    }

    updateGameAndPos(newX, newY) {
        matrix[newY][newX] = this.colorValue;
        matrix[this.y][this.x] = 0;
        this.x = newX;
        this.y = newY;
    }

    eat() {
        let fields = this.findFields(1);
        if (fields.length > 0) {
            let randomIndex = Math.floor(Math.random() * fields.length);
            let pos = fields[randomIndex];
            this.updateGameAndPos(pos[0], pos[1]);
            utils.removeFromList(this, grassArr); // Gras löschen

            this.eatCount++;
            this.notEaten = 0;
            this.mul();

        } else {
            this.notEaten++;
            this.eatCount = 0;
            if (this.notEaten >= 5) {
                this.die();
            } else {
                this.move();
                this.mul();
            }
        }
    }

    move() {
        let emptyFields = this.findFields(0);
        if (emptyFields.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptyFields.length);
            let pos = emptyFields[randomIndex];
            this.updateGameAndPos(pos[0], pos[1]);
        }
    }

    die() {
        matrix[this.y][this.x] = 0;
        utils.removeFromList(this, grazerArr);
    }

    mul() {
        if (this.eatCount >= 5) {
            let pos = utils.findRandomPosFor(this, 0);
            if (pos !== undefined) {
                grazerArr.push(new Grazer(pos[0], pos[1]));
                matrix[pos[1]][pos[0]] = this.colorValue;
            }
            this.eatCount = 0;
        }
    }
}
