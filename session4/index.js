const os = require("os");

let message = "The operation system is";

function main (){
    console.log(message + os.platform());
}

main();