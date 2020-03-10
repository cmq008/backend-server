/*jshint esversion: 6 */

// Requires
var express = require('express');

var app = express();

// Importar token
var mdAutenticacion = require('../middlewares/autenticacion');

// Importar modelo
var Carta = require('../models/carta');

// Obtener datos de las cartas

app.get('/', (req, resp, next) => {

    var desde = req.query.desde || 0;

    desde = Number(desde);

    Carta.find({})
        .skip(desde)
        .exec(
            (err, cartas) => {

                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando cartas',
                        errors: err
                    });
                }

                Carta.count({}, (err, conteo) => {
                    resp.status(200).json({
                        ok: true,
                        cartas: cartas,
                        total: conteo
                    });
                });

            });

});

// Crear un nueva carta

app.post('/', mdAutenticacion.verificaToken, (req, resp) => {

    // Usar libreria body parser node

    var body = req.body;

    var vence = 0;

    var carta = new Carta({
        orden: body.orden,
        ruc: body.ruc,
        razonSocial: body.razonSocial,
        nroCarta: body.nroCarta,
        BancoRazonSocial: body.BancoRazonSocial,
        nroDocumento: body.nroDocumento,
        Monto: body.Monto,
        Estado: body.Estado,
        AreaRespuesta: body.AreaRespuesta,
        FechaPresentacion: body.FechaPresentacion,
        FechaVencimiento: body.FechaVencimiento,
        Vencimiento: body.Vencimiento
    });

    vence = Math.floor(carta.FechaVencimiento / 1000) - Math.floor(carta.FechaPresentacion / 1000);
    vence = vence / 3600 / 24;
    body.Vencimiento = vence;

    carta.save((err, cartaGuardada) => {

        cartaGuardada.Vencimiento = body.Vencimiento;

        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: this.resultado,
                errors: err
            });
        }

        resp.status(201).json({
            ok: true,
            Vencimiento: body.Vencimiento,
            carta: cartaGuardada
        });

    });

});

// Eliminar carta por id

app.delete('/:id', mdAutenticacion.verificaToken, (req, resp) => {

    var id = req.params.id;

    Carta.findByIdAndRemove(id, (err, cartaBorrada) => {

        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al borrar carta',
                errors: err
            });
        }

        if (!cartaBorrada) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe la carta con id: ' + id,
                errors: { message: 'No existe una carta con ese ID' }
            });
        }

        resp.status(200).json({
            ok: true,
            carta: cartaBorrada
        });

    });

});

// Actualizar una carta

app.put('/:id', mdAutenticacion.verificaToken, (req, resp) => {

    var id = req.params.id;
    var body = req.body;

    Carta.findById(id, (err, carta) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cartas',
                errors: err
            });
        }

        if (!carta) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe la carta con id: ' + id,
                errors: { message: 'No existe un carta con ese ID' }
            });
        }

        carta.orden = body.orden;
        carta.ruc = body.ruc;
        carta.razonSocial = body.razonSocial;
        carta.nroCarta = body.nroCarta;
        carta.BancoRazonSocial = body.BancoRazonSocial;
        carta.nroDocumento = body.nroDocumento;
        carta.Monto = body.Monto;
        carta.Estado = body.Estado;
        carta.AreaRespuesta = body.AreaRespuesta;
        carta.FechaPresentacion = body.FechaPresentacion;
        carta.FechaVencimiento = body.FechaVencimiento;

        carta.save((err, cartaGuardada) => {

            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar carta',
                    errors: err
                });
            }

            resp.status(200).json({
                ok: true,
                carta: cartaGuardada
            });

        });

    });

});


// Usar la ruta fuera del archivo
module.exports = app;