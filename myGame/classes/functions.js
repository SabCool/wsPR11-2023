const findRandomPosFor = (obj, symbol) => {
    let fields = obj.findFields(symbol);
    if(fields.length > 0){
        let randomIndex = Math.floor(Math.random() * fields.length);
        return fields[randomIndex];
    }else{
        return undefined;
    }
}

const removeFromList = (obj, list) => {
    for (let i = 0; i < list.length; i++) {
        if(obj.x == list[i].x && obj.y == list[i].y){
            list.splice(i, 1);
            break;
        }  
    }
}

module.exports = {removeFromList, findRandomPosFor}