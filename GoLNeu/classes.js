class LivingCreature {
    constructor(x, y) {
        //Position
        this.x = x;
        this.y = y;
        // Sicht auf die Nachbarfelder
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
        let found = [];
        for (let i = 0; i < this.neighbors.length; i++) {
            const pos = this.neighbors[i]; // [x, y]
            let posX = pos[0];
            let posY = pos[1];
            if (posX >= 0 && posX < matrix[0].length &&
                posY >= 0 && posY < matrix.length) {
                if (matrix[posY][posX] == symbol) {
                    found.push(pos);
                }
            }

        }
        return found;
    }
}

class Grass extends LivingCreature{
    constructor(x, y) {
        super(x,y);
        // Farbe - grün
        this.colorValue = 1;
        this.roundCount = 0;
    }
    mul() {
        // counter > 6 , dann vermehren
        this.roundCount++;
        if (this.roundCount >= 6) {
            let emptyFields = this.findFields(0);
            if (emptyFields.length > 0) {
                let newPos = random(emptyFields); // [x,y]
                let newX = newPos[0];
                let newY = newPos[1];
                grassArr.push(new Grass(newX, newY));
                matrix[newY][newX] = this.colorValue;
            }
            this.roundCount = 0;
        }
    }
}

class Grazer extends LivingCreature{
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
            let pos = random(fields);
            this.updateGameAndPos(pos[0], pos[1]);
            removeFromList(this, grassArr); // Gras löschen

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
            let pos = random(emptyFields);
            this.updateGameAndPos(pos[0], pos[1]);
        }
    }

    die() {
        matrix[this.y][this.x] = 0;
        removeFromList(this, grazerArr);
    }

    mul() {
        if (this.eatCount >= 5) {
            let pos = findRandomPosFor(this, 0);
            if (pos !== undefined) {
                grazerArr.push(new Grazer(pos[0], pos[1]));
                matrix[pos[1]][pos[0]] = this.colorValue;
            }
            this.eatCount = 0;
        }
    }
}

class Predator extends LivingCreature{
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