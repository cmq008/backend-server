/*jshint esversion: 8 */

// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Creacion de config.js para constantes
var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

// Google

var CLIENT_ID = require('../config/config').CLIENT_ID;

var { OAuth2Client } = require('google-auth-library');
var client = new OAuth2Client(CLIENT_ID);

// Autenticacion de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.nombre,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}


app.post('/google', async(req, resp) => {

    var token = req.body.token;

    var googleUser = await verify(token).catch(err => {
        resp.status(403).json({
            ok: false,
            mensaje: 'Token no valido',
            errors: err
        });
    });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (usuarioDB) {

            if (usuarioDB.google === false) {

                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar su autenticacion normal',
                    errors: err
                });

            } else {

                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 10400 }); //4 horas

                // Confirmacion de inicio de sesion

                resp.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                    menu: obtenerMenu(usuarioDB.role)
                });

            }


        } else {
            // El usuario no existe hay que crearlo

            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar usuario',
                        errors: err
                    });
                }

                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 3600 }); //4 horas

                // Confirmacion de inicio de sesion

                resp.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                    menu: obtenerMenu(usuarioDB.role)
                });

            });

        }



    });

    resp.status(200).json({
        ok: true,
        mensaje: 'OK!!',
        googleUser: googleUser
    });


});




// Autenticacion normal

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
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 3600 }); //4 horas

        // Confirmacion de inicio de sesion

        resp.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)
        });

    });

});

function obtenerMenu(ROLE) {

    var menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'PorcentajeBar', url: '/progress' },
                { titulo: 'Graficas', url: '/graficas1' },
                { titulo: 'Promesas', url: '/promesas' },
                { titulo: 'RXJS', url: '/rxjs' }
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-black-mesa',
            submenu: [
                // { titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Hospitales', url: '/hospitales' },
                { titulo: 'Medicos', url: '/medicos' }
            ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }

    return menu;

}

// Usar la ruta fuera del archivo
module.exports = app;