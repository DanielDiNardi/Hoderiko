const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('HAMDatabase.db');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/"));
app.listen(3000, function(){
    console.log('Server started, Hello Hoderiko :)');
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/HTML/index.html');
});

// app.post('/', (req, res) => {
//     res.send("POST Request Called")
// })


