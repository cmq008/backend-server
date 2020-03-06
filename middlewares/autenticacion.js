/*jshint esversion: 6 */

var jwt = require('jsonwebtoken');


// Creacion de config.js para constantes
var SEED = require('../config/config').SEED;

// Verificar Token

exports.verificaToken = function(req, resp, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return resp.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();

        // return resp.status(200).json({
        //    ok: true,
        //    decoded: decoded
        // });

    });


};

// Verificar Admin

exports.verificaAdmin = function(req, resp, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {

        next();
        return;

    } else {

        return resp.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - no es administrador',
            errors: { message: 'No es administrador' }
        });

    }

};

// Verificar Admin o mismo usuario

exports.verificaAdminOelUsuario = function(req, resp, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {

        next();
        return;

    } else {

        return resp.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - no es administrador ni es el mismo usuario',
            errors: { message: 'No es administrador' }
        });

    }

};