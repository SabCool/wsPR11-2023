let matrix = [];
let side = 10;

function main(){
    const socket = io();

    console.log('ready to display GoL...');

    function gotMatrix(data){
        console.log(data);
        matrix = data;
    }
    socket.on('matrix', gotMatrix);

}

function setup(){
    createCanvas(500, 500);
}

function draw(){
    console.log('zeichne...', matrix)
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

window.onload = main;