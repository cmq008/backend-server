/*jshint esversion: 6 */

// Requires
var express = require('express');
var bcrypt = require('bcryptjs');

// Importar token
var mdAutenticacion = require('../middlewares/autenticacion');

// Creacion de config.js para constantes
// var SEED = require('../config/config').SEED;

var app = express();

var Medico = require('../models/medico');

// Obtener datos de los medicos

app.get('/', (req, resp, next) => {

    var desde = req.query.desde || 0;

    desde = Number(desde);

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {

                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {
                    resp.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });

            });

});

// Obtener medico

app.get('/:id', (req, resp, next) => {

    var id = req.params.id;

    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec(
            (err, medico) => {

                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }

                if (!medico) {
                    return resp.status(400).json({
                        ok: false,
                        mensaje: 'No existe el medico con id: ' + id,
                        errors: { message: 'No existe un medico con ese ID' }
                    });
                }

                resp.status(200).json({
                    ok: true,
                    medico: medico
                });

            }
        );

});





// Actualizar un medico

app.put('/:id', mdAutenticacion.verificaToken, (req, resp) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe el medico con id: ' + id,
                errors: { message: 'No existe un medico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            resp.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});


// Crear un nuevo hospital

app.post('/', mdAutenticacion.verificaToken, (req, resp) => {

    // Usar libreria body parser node

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        resp.status(201).json({
            ok: true,
            medico: medicoGuardado,
            medicoToken: req.medico
        });

    });

});


// Eliminar hospital por id

app.delete('/:id', mdAutenticacion.verificaToken, (req, resp) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe el medico con id: ' + id,
                errors: { message: 'No existe un medico con ese ID' }
            });
        }

        resp.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});



// Usar la ruta fuera del archivo
module.exports = app;