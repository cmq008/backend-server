/*jshint esversion: 6 */

// Requires
var express = require('express');

var app = express();

// Importar token
var mdAutenticacion = require('../middlewares/autenticacion');

// Importar modelo
var Carta = require('../models/carta');

//Modelo fechas
var date = require('date-and-time');

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
        DocRelacionado: body.DocRelacionado,
        FechaDocRelacionado: body.FechaDocRelacionado,
        NroEsquelaSustitucion: body.NroEsquelaSustitucion,
        FechaSustitucion: body.FechaSustitucion,
        FechaEjecucion: body.FechaEjecucion,
        NroEsquelaDevolucion: body.NroEsquelaDevolucion,
        NroActaEntrega: body.NroActaEntrega,
        FechaDevolucion: body.FechaDevolucion,
        RegistroResponsable: body.RegistroResponsable,
        Observaciones: body.Observaciones,
    });

    carta.save((err, cartaGuardada) => {

        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: this.resultado,
                errors: err
            });
        }

        resp.status(201).json({
            ok: true,
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
        carta.DocRelacionado = body.DocRelacionado;
        carta.FechaDocRelacionado = body.FechaDocRelacionado;
        carta.NroEsquelaSustitucion = body.NroEsquelaSustitucion;
        carta.FechaSustitucion = body.FechaSustitucion;
        carta.FechaEjecucion = body.FechaEjecucion;
        carta.NroEsquelaDevolucion = body.NroEsquelaDevolucion;
        carta.NroActaEntrega = body.NroActaEntrega;
        carta.FechaDevolucion = body.FechaDevolucion;
        carta.RegistroResponsable = body.RegistroResponsable;
        carta.Observaciones = body.Observaciones;

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

// Obtener carta

app.get('/:id', (req, resp, next) => {

    var id = req.params.id;

    Carta.findById(id)
        .exec(
            (err, carta) => {

                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando carta',
                        errors: err
                    });
                }

                if (!carta) {
                    return resp.status(400).json({
                        ok: false,
                        mensaje: 'No existe la carta con id: ' + id,
                        errors: { message: 'No existe una carta con ese ID' }
                    });
                }

                resp.status(200).json({
                    ok: true,
                    carta: carta
                });

            }
        );

});


// Usar la ruta fuera del archivo
module.exports = app;