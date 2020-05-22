/*jshint esversion: 6 */

// Requires
var express = require('express');

var nodeoutlook = require('nodejs-nodemailer-outlook');

var app = express();

// Importar token
var mdAutenticacion = require('../middlewares/autenticacion');

var CORREO = require('../config/config').CORREO;
var PASSWORD = require('../config/config').PASSWORD;

var Email = require('../models/email');


// Enviar correo electronico

app.post('/', mdAutenticacion.verificaToken, (req, resp) => {

    // Usar libreria body parser node

    var body = req.body;

    var cuerpo = new Email({
        to: body.to,
        cc: body.cc,
        subject: body.subject,
        html: body.html,
    });

    nodeoutlook.sendEmail({
        auth: {
            user: CORREO,
            pass: PASSWORD
        },
        from: CORREO,
        to: cuerpo.to,
        cc: cuerpo.cc,
        subject: cuerpo.subject,
        html: body.html,
        onError: err => {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al enviar correo electronico',
                errors: err
            });
        },
        onSuccess: i => {
            return resp.status(201).json({
                ok: true,
                mensaje: i
            });
        }
    });

});

// Usar la ruta fuera del archivo
module.exports = app;