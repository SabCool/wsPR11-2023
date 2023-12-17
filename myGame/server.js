
const Grass = require("./classes/grass.js");
const Grazer = require("./classes/grazer.js");
const Predator = require("./classes/predator.js");

const express = require("express");
const app = express();

let server = require('http').Server(app);
let io = require('socket.io')(server);

let clients = [];
let isGameRunning = false;

app.use(express.static('./client'));

app.get('/', function (req, res){
    res.redirect('index.html');
});

server.listen(3000, function (){
    console.log("Der Server läuft auf port 3000...");
    // initGame();
    // setInterval(function(){
    //     updateGame();
        
    // }, 1000);

    io.on('connection', function(socket){
        console.log('ws connection established...');
        clients.push(socket.id);
        socket.emit('matrix', matrix);


        if(clients.length == 1 && isGameRunning == false){
            console.log("Starte Spiel... wenn noch nicht gestartet...");
            // initGame();
            // setInterval(updateGame, 1000);
            // isGameRunning = true;
            // setInterval(raining, 4000);
        }
    });
   
});



// game logic on server
matrix = [
    [0, 0, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 1, 0, 3, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 0, 2, 0],
    [1, 1, 0, 2, 0],
    [1, 1, 0, 0, 0]
 ];

grassArr = [];
grazerArr = [];
predatorArr =[];

function getRandMatrix(cols, rows){
    let matrix = [];
    for(let y = 0; y <= rows; y++){
        matrix.push([]);
        for(let x = 0; x <= cols; x++){
            matrix[y][x] = Math.floor(Math.random() * 2);
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


function initGame(){
    console.log('init game....');
    matrix = getRandMatrix(50,50);
    addMoreCreatures();

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

    // console.log("Sende matrix zu clients")
    // io.sockets.emit('matrix', matrix);
}

function updateGame(){
    console.log("update game...");
    for(let i = 0; i < grassArr.length; i++){
        let grassObj = grassArr[i];
        grassObj.mul();
    }

    for(let i = 0; i < grazerArr.length; i++){
        let grazerObj = grazerArr[i];
        grazerObj.eat();
        grazerObj.mul();

    }
    //console.log(matrix);
    // console.log("sende matrix zu clients...");
    // io.sockets.emit('matrix', matrix);
}