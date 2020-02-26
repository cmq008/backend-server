/*jshint esversion: 6 */

// Requires
var express = require('express');

var app = express();

app.get('/', (req, resp, next) => {

    resp.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });

});


// Usar la ruta fuera del archivo
module.exports = app;