const express = require('express');
const body_parser = require('body-parser');
const user = require('./routes/user-route/user');
const mongoose = require('mongoose');
const db = require('./config/databse');
const cors = require('cors');
const path = require('path');

var port = process.env.PORT || 8080;
var app = express();

//CORS middleware
app.use(cors());

// connect to mongodb
mongoose.connect(db.database, { useNewUrlParser: true }, (err, db) => {
    if (err) {
        console.log('some error with mongodb',err);
    };
    if (db) { console.log('you are connected to Mongodb'); }
});

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/build/index.html'));
});

// bodyparser middleware
// to parse incoming data in JSON format
app.use(body_parser.json());
// If extended is false, you can not post "nested object"
app.use(body_parser.urlencoded({ extended: true}));

// app listening on port = 2300
app.listen(port, (err) => {
    if (err) throw err;
    console.log('listen on port :', port);
});

// Routing to controllers
app.use('/', user);

exports = app;
