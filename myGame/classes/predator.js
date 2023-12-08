const LivingCreature = require("./livingCreature.js");
module.exports = class Predator extends LivingCreature{
    constructor(x, y) {
        super(x,y);
        // Farbe - red
        this.colorValue = 3;
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
        return super.findFields(symbol);
    }

    updateGameAndPos(newX, newY) {
        matrix[newY][newX] = this.colorValue;
        matrix[this.y][this.x] = 0;
        this.x = newX;
        this.y = newY;
    }

    eat() {
        let fields = this.findFields(2);
        if (fields.length > 0) {
            let pos = random(fields);
            this.updateGameAndPos(pos[0], pos[1]);
            removeFromList(this, grazerArr); // Grasfresser löschen

            this.eatCount++;
            this.notEaten = 0;

            this.mul();

        } else {
            this.notEaten++;
            this.eatCount = 0;
            if (this.notEaten >= 8) {
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
            let pos = random(emptyFields);
            this.updateGameAndPos(pos[0], pos[1]);
        }
    }

    die() {
        matrix[this.y][this.x] = 0;
        removeFromList(this, predatorArr);
    }

    mul() {
        if (this.eatCount >= 5) {
            let emptyFields = this.findFields(0);
            if (emptyFields.length > 0) {
                let pos = random(emptyFields);

                predatorArr.push(new Predator(pos[0], pos[1]));
                matrix[pos[1]][pos[0]] = this.colorValue;
            }
            this.eatCount = 0;
        }
    }
}