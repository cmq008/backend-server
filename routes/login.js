/*jshint esversion: 6 */

// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, resp) => {

    // Usar libreria body parser node

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - Email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return resp.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });

        }

        // Crear un token (jsonwebtoken)

        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, '@este-es@un-seed-dificil', { expiresIn: 600 }); //4 horas

        // Confirmacion de inicio de sesion

        resp.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    });



});











// Usar la ruta fuera del archivo
module.exports = app;