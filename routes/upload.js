/*jshint esversion: 6 */

// Requires
var express = require('express');
var fileUpload = require('express-fileupload');

var app = express();

// default options
app.use(fileUpload());

app.put('/', (req, resp, next) => {

    if (!req.files) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo extensiones validas

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        return resp.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
        });

    }

    resp.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente',
        extensionArchivo: extensionArchivo
    });

});


// Usar la ruta fuera del archivo
module.exports = app;