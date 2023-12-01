let matrix = [
    [0, 0, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 1, 0, 3, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 0, 2, 0],
    [1, 1, 0, 2, 0],
    [1, 1, 0, 0, 0]
 ];

let fr = 5;
let side = 10;

// Lebewesenlisten

let grassArr = [];
let grazerArr = [];
let predatorArr =[];

function getRandMatrix(cols, rows){
    let matrix = [];
    for(let y = 0; y <= rows; y++){
        matrix.push([]);
        for(let x = 0; x <= cols; x++){
            matrix[y][x] = Math.floor(random(0,2));
        }
    }
    return matrix;
}

function addMoreCreatures(){
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if(y == x){
                if(y % 2 == 0) matrix[y][x] = 3;
                else matrix[y][x] =2;
            }
        }
    }
}

// Funktion, die wird einmal ausgeführt bei Programmstart
function setup(){

    matrix =getRandMatrix(50,50);
    addMoreCreatures();

    createCanvas(matrix[0].length * side + 1, matrix.length * side + 1);
    background("#acacac");
    frameRate(fr);

    // durch Matrix laufen und Lebewesen erstellen
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if(matrix[y][x] == 1){
                let grassObj = new Grass(x,y);
                grassArr.push(grassObj);
            }else if(matrix[y][x] == 2){
                let grazerObj = new Grazer(x,y);
                grazerArr.push(grazerObj);
            }else if(matrix[y][x] == 3){
                let predatorObj = new Predator(x,y);
                predatorArr.push(predatorObj);
            } 
        }   
    }
}

// Funktion wiederholend ausgeführt
function draw(){
   
    // alle Lebewesen updaten
    for(let i = 0; i < grassArr.length; i++){
        let grassObj = grassArr[i];
        grassObj.mul();
    }

    for(let i = 0; i < grazerArr.length; i++){
        let grazerObj = grazerArr[i];
        grazerObj.eat();
        grazerObj.mul();

    }

    for(let i = 0; i < predatorArr.length; i++){
        let predatorObj = predatorArr[i];
        predatorObj.eat();
        predatorObj.mul();

    }

    for (let y = 0; y < matrix.length; y++) {
       for (let x = 0; x < matrix[y].length; x++) {
            fill("#ffffff");
            let farbWert = matrix[y][x];
            if(farbWert === 1){
                fill("#00ff00");
            }else if(farbWert === 2){
                fill("#ffff00");
            }else if(farbWert === 3){
                fill("#ff0000");
            }else if(farbWert === 4){
                fill("#826E40");
            }else if(farbWert === 5){
                fill("#FF00ff");
            }
            rect(x * side, y *side, side, side);
       }   
    }
}
