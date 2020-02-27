/*jshint esversion: 6 */

// Requires
var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', (req, resp, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImage = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImage)) {
        resp.sendFile(pathImage);
    } else {
        var pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg`);
        resp.sendFile(pathNoImage);
    }

});


// Usar la ruta fuera del archivo
module.exports = app;