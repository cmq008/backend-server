// Requires
var express = require('express');

var app = express();

var Usuario = require('../models/usuario');

app.get('/', (req, resp, next) => {

    Usuario.find({}, 'nombre username img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuario',
                        errors: err
                    });
                }

                resp.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            });

});

// Usar la ruta fuera del archivo
module.exports = app;