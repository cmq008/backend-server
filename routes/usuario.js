/*jshint esversion: 6 */

// Requires
var express = require('express');
var bcrypt = require('bcryptjs');


var app = express();

var Usuario = require('../models/usuario');

// Obtener datos de los usuaros

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


// Crear un nuevo usuario

app.post('/', (req, resp) => {

    // Usar libreria body parser node

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        resp.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });

    });

});

// Actualizar un usuario

app.put('/:id', (req, resp) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe el usuario con id: ' + id,
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            resp.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});

// Eliminar usuario por id

app.delete('/:id', (req, resp) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe el usuario con id: ' + id,
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        resp.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});



// Usar la ruta fuera del archivo
module.exports = app;