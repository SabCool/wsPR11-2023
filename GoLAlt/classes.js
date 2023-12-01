class LivingCreature {
    constructor(x, y) {
        //Position
        this.x = x;
        this.y = y;
        // Sicht auf die Nachbarfelder
        this.directions = [
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

    chooseFields(character) {
        let found = [];
        for (let i in this.directions) {
            i = parseInt(i);
            let fieldPos = this.directions[i];
            let posX = fieldPos[0];
            let posY = fieldPos[1];
            // Wenn innerhalb der Spielfeldgrenzen / Matrix
            if (posX >= 0 && posX < matrix[0].length && posY >= 0 && posY < matrix.length) {
                if (matrix[posY][posX] == character) {
                    found.push(fieldPos);
                }
            }
        }
        return found;
    }
}

// Grass
class Grass extends LivingCreature{
    constructor(x, y) {
        super(x, y);
        this.multiply = 0;
        this.ALLOWED_TO_MUL = 6;
    }
    mul() {
        // rundenzähler erhöhen
        this.multiply++;
        // Vermehrung soll erfolgen wenn Rundenzähler 6 ist
        if (this.multiply >= this.ALLOWED_TO_MUL) {
            // finde alle leeren Nachbarfelder
            let emptyFields = this.chooseFields(0);
            if (emptyFields.length > 0) {
                // wenn es welche gibt, dann wähle eines davon zufällig aus
                let theChosenField = random(emptyFields); // Array mit 2 element - x und y
                // Erzeuge neues Grass-Objekt mit Pos des ausgewählten Nachbarfeldes
                let newX = theChosenField[0];
                let newY = theChosenField[1];
                let grassObj = new Grass(newX, newY);
                // zur Grassobj-Liste hinzufügen
                grassArr.push(grassObj);
                // Matrix wird an dieser Pos statt der 0 eine 1
                matrix[newY][newX] = 1;
            }

            this.multiply = 0;
        }
    }
}

// Grasfresser
class Grazer {
    constructor(x, y) {
        //Position
        this.x = x;
        this.y = y;
        // Fressenzähler
        this.eatCount = 0;
        this.ALLOWED_TO_MUL = 5;
        this.notEatCount = 0;

        // Sicht auf die Nachbarfelder
        this.directions = [
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

    updateDirections() {
        this.directions = [
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

    chooseFields(character) {
        this.updateDirections();
        return super.chooseFields(character);
        // let found = [];
        // for (let i in this.directions) {
        //     i = parseInt(i);
        //     let fieldPos = this.directions[i];
        //     let posX = fieldPos[0];
        //     let posY = fieldPos[1];
        //     if (posX >= 0 && posX < matrix[0].length && posY >= 0 && posY < matrix.length) {
        //         if (matrix[posY][posX] == character) {
        //             found.push(fieldPos);
        //         }
        //     }
        // }
        // return found;
    }

    // weiteres Verhalten
    eat() {
        // suchen nach Grasobjekten in der Nachbarschaft
        let grassFields = this.chooseFields(1);
        // ist Grass vorhanden wähle zufällig eines aus
        if (grassFields.length > 0) {
            let theChosenField = random(grassFields);
            let newX = theChosenField[0];
            let newY = theChosenField[1];
            // Grasobjekt fressen: 
            // Positionen in der Matrix / Spielfeld aktualisieren
            // neue Pos bekommt Wert 2
            matrix[newY][newX] = 2;
            // alte Pos bekommt Wert 0
            matrix[this.y][this.x] = 0;
            // eigene Position updaten
            this.x = newX;
            this.y = newY;
            // Grasobjekt aus GrassArr löschen
            // finden in der Liste: Wie?
            for (let i = 0; i < grassArr.length; i++) {
                let grassObj = grassArr[i];
                // Prüfen der Positionswerte
                if (grassObj.x == this.x && grassObj.y == this.y) {
                    // löschen
                    grassArr.splice(i, 1);
                    break;
                }
            }

            // eatcounter erhöhen
            this.eatCount += 1;
            // reset not eaten
            this.notEatCount = 0
        } else {
            this.eatCount = 0;
            this.notEatCount += 1;

            if (this.notEatCount >= 5) { // 5 Runden nichts gefressen
                this.die();
            } else {
                this.move();
            }
        }
    }

    move() {
        let emptyFields = this.chooseFields(0);
        if (emptyFields.length > 0) {
            let theChosenField = random(emptyFields);
            let newX = theChosenField[0];
            let newY = theChosenField[1];
            matrix[newY][newX] = 2;
            matrix[this.y][this.x] = 0;
            this.x = newX;
            this.y = newY;
        }
    }

    die() {
        matrix[this.y][this.x] = 0;
        for (let i = 0; i < grazerArr.length; i++) {
            let grazerObj = grazerArr[i];
            if (grazerObj.x == this.x && grazerObj.y == this.y) {
                grazerArr.splice(i, 1);
                break;
            }
        }
    }

    mul() {
        if (this.eatCount >= this.ALLOWED_TO_MUL) {
            // finde alle leeren Nachbarfelder
            let emptyFields = this.chooseFields(0);
            if (emptyFields.length > 0) {
                let theChosenField = random(emptyFields); // Array mit 2 element - x und y
                let newX = theChosenField[0];
                let newY = theChosenField[1];
                let grazerObj = new Grazer(newX, newY);
                grazerArr.push(grazerObj);
                matrix[newY][newX] = 2;
            }
            this.eatCount = 0; // eatCounter reset
        }
    }
}

class Predator {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.eaten = 10;
        this.notEaten = 5;

        this.directions = [
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

    updateDirections() {
        this.directions = [
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


    chooseFields(character) {
        this.updateDirections();
        let found = [];
        for (let i in this.directions) {
            i = parseInt(i);
            let fieldPos = this.directions[i];
            let posX = fieldPos[0];
            let posY = fieldPos[1];
            if (posX >= 0 && posX < matrix[0].length && posY >= 0 && posY < matrix.length) {
                if (matrix[posY][posX] == character) {
                    found.push(fieldPos);
                }
            }
        }
        return found;
    }

    move() {
        let emptyFields = this.chooseFields(0);
        if (emptyFields.length > 0) {
            let theChosenField = random(emptyFields);
            let newX = theChosenField[0];
            let newY = theChosenField[1];
            matrix[newY][newX] = 3;
            matrix[this.y][this.x] = 0;
            this.x = newX;
            this.y = newY;
        }
    }

    die() {
        matrix[this.y][this.x] = 0;
        for (let i = 0; i < predatorArr.length; i++) {
            let pred = predatorArr[i];
            if (pred.x == this.x && pred.y == this.y) {
                predatorArr.splice(i, 1);
                break;
            }
        }
    }

    eat() {
        // suchen nach Grasobjekten in der Nachbarschaft
        let grazerFields = this.chooseFields(2);
        // ist Grass vorhanden wähle zufällig eines aus
        if (grazerFields.length > 0) {
            let theChosenField = random(grazerFields);
            let newX = theChosenField[0];
            let newY = theChosenField[1];

            matrix[newY][newX] = 3;
            matrix[this.y][this.x] = 0;
            this.x = newX;
            this.y = newY;

            for (let i = 0; i < grazerArr.length; i++) {
                let grazerObj = grazerArr[i];
                if (grazerObj.x == this.x && grazerObj.y == this.y) {
                    grazerArr.splice(i, 1);
                    break;
                }
            }

            this.eaten += 1;
            this.notEaten = 0;

        } else {

            this.eaten = 0;
            this.notEaten += 1;

            if (this.notEaten >= 8) {
                this.die();
            } else {
                this.move();
            }
        }
    }

    mul() {
        if (this.eaten >= 5) {
            // finde alle leeren Nachbarfelder
            let emptyFields = this.chooseFields(0);
            if (emptyFields.length > 0) {
                let theChosenField = random(emptyFields); // Array mit 2 element - x und y
                let newX = theChosenField[0];
                let newY = theChosenField[1];
                let predatorObj = new Predator(newX, newY);
                predatorArr.push(predatorObj);
                matrix[newY][newX] = 3;
            }
            this.eaten = 0;
        }
    }
}


// class Toadstool {
//     constructor(x, y) {
//         this.x = x
//         this.y = y
//         this.directions = [
//             [this.x - 1, this.y - 1],
//             [this.x    , this.y - 1],
//             [this.x + 1, this.y - 1],
//             [this.x - 1, this.y    ],
//             [this.x + 1, this.y    ],
//             [this.x - 1, this.y + 1],
//             [this.x    , this.y + 1],
//             [this.x + 1, this.y + 1]
//         ]
//     }
//     eat() {
//         let cells = this.directions
//         for(let i in cells) {
//             i = parseInt(i);
//             let newX = cells[i][0]
//             let newY = cells[i][1]
//             if (matrix[newY][newX]==1){
//                 //lösche aus grass liste 
//                 for(let i = 0; i < grassArr.length; i++){
//                     let grassObj = grassArr[i];
//                     // Prüfen der Positionswerte
//                     if(grassObj.x == newX && grassObj.y == newY){
//                         // löschen
//                         grassArr.splice(i, 1);
//                         break;
//                     }
//                 }
//             }else if (matrix[newY][newX]==2){
//                 // lösche grazer 
//                 for(let i = 0; i < grazerArr.length; i++){
//                     let grazerObj =grazerArr[i];
//                     // Prüfen der Positionswerte
//                     if(grazerObj.x == newX && grazerObj.y == newY){
//                         // löschen
//                        grazerArr.splice(i, 1);
//                         break;
//                     }
//                 }


//             }else if (matrix[newY][newX]==3){
//                 //lösche fleischfresser 
//                 for(let i = 0; i < predatorArr.length; i++){
//                     let predatorObj =predatorArr[i];
//                     // Prüfen der Positionswerte
//                     if(predatorObj.x == newX && predatorObj.y == newY){
//                         // löschen
//                       predatorArr.splice(i, 1);
//                         break;
//                     }
//                 }
//             }else if (matrix[newY][newX]==5){
//                 //lösche fleischfresser 
//                 for(let i = 0; i < kannibaleArr.length; i++){
//                     let kannibaleObj =kannibaleArr[i];
//                     // Prüfen der Positionswerte
//                     if(kannibaleObj.x == newX &&kannibaleObj.y == newY){
//                         // löschen
//                       kannibaleArr.splice(i, 1);
//                         break;
//                     }
//                 }
//             }


//             matrix[cells[i][1]][cells[i][0]] = 0
//         }
//     }
// }





// class Kannibale {
//     constructor(x, y){
//         //Position
//         this.x = x;
//         this.y = y;
//         // Fressenzähler
//         this.multiply=0;
//         this.energy = 15;
//         this.notEaten =5;

//         // Sicht auf die Nachbarfelder
//         this.directions = [
//             [this.x -1, this.y -1],
//             [this.x, this.y-1],
//             [this.x+1, this.y-1],
//             [this.x-1, this.y],
//             [this.x+1, this.y],
//             [this.x-1, this.y+1],
//             [this.x, this.y+1],
//             [this.x+1, this.y+1]
//         ];
//     }
//     newDirections(){
//         this.directions = [
//             [this.x -1, this.y -1],
//             [this.x, this.y-1],
//             [this.x+1, this.y-1],
//             [this.x-1, this.y],
//             [this.x+1, this.y],
//             [this.x-1, this.y+1],
//             [this.x, this.y+1],
//             [this.x+1, this.y+1]
//         ];
//     }


//     chooseFields(character){
//         this.newDirections();
//         let found = [];
//         for(let i in this.directions){
//             i = parseInt(i);
//             let fieldPos = this.directions[i];
//             let posX = fieldPos[0];
//             let posY = fieldPos[1];
//             if(posX >= 0 && posX < matrix[0].length && posY >= 0 && posY < matrix.length){
//                 if(matrix[posY][posX] == character){
//                     found.push(fieldPos);
//                 }
//             }
//         }
//         return found;
//     }

//     move(){
//         let emptyFields=this.chooseFields(0);
//         if(emptyFields.length>0){
//             let theChosenField =random(emptyFields);
//             let newX = theChosenField[0];
//             let newY= theChosenField[1];
//             matrix[newY][newX]=5;
//             matrix[this.y][this.x]=0;
//             this.x =newX;
//             this.y=newY;

//         }

//     }

//     eat_predator(){
//         // suchen nach Grasobjekten in der Nachbarschaft
//         let predatorFields = this.chooseFields(5);
//         // ist Grass vorhanden wähle zufällig eines aus
//         if(predatorFields.length > 0 && this.energy>0){
//             let theChosenField = random(predatorFields);
//             let newX = theChosenField[0];
//             let newY = theChosenField[1];
//             // Grasobjekt fressen: 

//             // Positionen in der Matrix / Spielfeld aktualisieren
//             // neue Pos bekommt Wert 2
//             matrix[newY][newX] = 5;
//             // alte Pos bekommt Wert 0
//             matrix[this.y][this.x] = 0;

//             // eigene Position updaten
//             this.x = newX;
//             this.y = newY;

//             // Grasobjekt aus GrassArr löschen
//             // finden in der Liste: Wie?
//             for(let i = 0; i < predatorArr.length; i++){
//                 let predatorObj = predatorArr[i];
//                 // Prüfen der Positionswerte
//                 if(predatorObj.x == this.x && predatorObj.y == this.y){
//                     // löschen
//                     predatorArr.splice(i, 1);
//                     break;
//                 }
//             }

//             // eatcounter erhöhen
//             this.eatCount += 1;
//             this.energy++;
//         }else{
//             this.eatCount=0;
//             this.energy-=1;
//             if(this.energy<=0){
//                 this.die();
//             }else{
//                 this.move();
//             }


//         }
//     }

//     eat_grazer(){
//         // suchen nach Grasobjekten in der Nachbarschaft
//         let grazerFields = this.chooseFields(2);
//         // ist Grass vorhanden wähle zufällig eines aus
//         if(grazerFields.length > 0 && this.energy>0){
//             let theChosenField = random(grazerFields);
//             let newX = theChosenField[0];
//             let newY = theChosenField[1];
//             // Grasobjekt fressen: 

//             // Positionen in der Matrix / Spielfeld aktualisieren
//             // neue Pos bekommt Wert 2
//             matrix[newY][newX] = 5;
//             // alte Pos bekommt Wert 0
//             matrix[this.y][this.x] = 0;

//             // eigene Position updaten
//             this.x = newX;
//             this.y = newY;

//             // Grasobjekt aus GrassArr löschen
//             // finden in der Liste: Wie?
//             for(let i = 0; i < grazerArr.length; i++){
//                 let grazerObj = grazerArr[i];
//                 // Prüfen der Positionswerte
//                 if(grazerObj.x == this.x && grazerObj.y == this.y){
//                     // löschen
//                     grazerArr.splice(i, 1);
//                     break;
//                 }
//             }

//             // eatcounter erhöhen
//             this.eatCount += 1;
//             this.energy++;
//         }else{
//             this.eatCount=0;
//             this.energy-=1;
//             if(this.energy<=0){
//                 this.die();
//             }else{
//                 this.move();
//             }


//         }
//     }
//     mul(){
//         if(this.eatCount >= 5){
//             // finde alle leeren Nachbarfelder
//             let emptyFields = this.chooseFields(0);
//             if(emptyFields.length > 0){
//                 // wenn es welche gibt, dann wähle eines davon zufällig aus
//                 let theChosenField = random(emptyFields); // Array mit 2 element - x und y
//                 // Erzeuge neues Grass-Objekt mit Pos des ausgewählten Nachbarfeldes
//                 let newX = theChosenField[0];
//                 let newY = theChosenField[1];
//                 let kannibaleObj = new Kannibale (newX, newY);
//                 // zur Grassobj-Liste hinzufügen
//                 kannibaleArr.push(kannibaleObj);
//                 // Matrix wird an dieser Pos statt der 0 eine 1
//                 matrix[newY][newX] = 5;
//             }

//             this.eatCount = 0;
//         }


//         }
//     die(){
//         matrix[this.y][this.x]=0;
//         for(let i =0;i<kannibaleArr.length;i++){
//             let kannibaleObj= kannibaleArr[i];
//             if(kannibaleObj.x==this.x&&kannibaleObj.y==this.y){
//                 kannibaleArr.splice(i,1);
//                 break;
//             }


//         }
//     }
//  }



