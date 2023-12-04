const express = require('express');
const app = express();

app.use(express.static('../GoLNeu/'))

app.get("/", function(req, res){
    res.send("<h1>Hello Sabine... </h1><p>mein toller Text</p>");
} );

app.get("/google", function(req, res){
    res.redirect('https://google.com');
});

app.get("/search/:search", function(req, res){
    const searchTerm = req.params.search;
    res.redirect('https://google.com/search?q='+searchTerm);
});

app.get("/game", function(req,res){
    res.redirect("index.html");
})

app.get("/*", function(req, res){
    res.status(404).send("<p>Fehler 404: Datei nicht vorhanden...</p>");
})

app.listen(3000, function (){
    console.log("Server is running on port 3000...")
});