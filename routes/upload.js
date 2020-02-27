/*jshint esversion: 6 */

// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, resp, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de coleccion

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return resp.status(400).json({
            ok: false,
            mensaje: 'Tipo no valido',
        });

    }

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

    // Nombre de archivo personalizado

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temporal al Path

    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }


        subirPorTipo(tipo, id, nombreArchivo, resp);

    });




});

function subirPorTipo(tipo, id, nombreArchivo, resp) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {

                return resp.status(500).json({
                    ok: false,
                    mensaje: 'El usuario no existe',
                    errors: err
                });

            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            //Validar errores(no esta colocado)
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar archivo',
                    errors: err
                });
            }

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save(usuario, (err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                //Validar errores(no esta colocado)
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar archivo',
                        errors: err
                    });
                }

                return resp.status(200).json({
                    ok: true,
                    usuario: usuarioActualizado
                });

            });

        });

    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {

                return resp.status(500).json({
                    ok: false,
                    mensaje: 'El medico no existe',
                    errors: err
                });

            }

            var pathViejo = './uploads/medicos/' + medico.img;

            //Validar errores(no esta colocado)
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar ruta',
                    errors: err
                });
            }

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save(medico, (err, medicoActualizado) => {

                //Validar errores(no esta colocado)
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar archivo',
                        errors: err
                    });
                }

                return resp.status(200).json({
                    ok: true,
                    medico: medicoActualizado
                });

            });

        });

    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {

                return resp.status(500).json({
                    ok: false,
                    mensaje: 'El hospital no existe',
                    errors: err
                });

            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            //Validar errores(no esta colocado)
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar ruta',
                    errors: err
                });
            }

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save(hospital, (err, hospitalActualizado) => {

                //Validar errores(no esta colocado)
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar archivo',
                        errors: err
                    });
                }

                return resp.status(200).json({
                    ok: true,
                    usuario: hospitalActualizado
                });

            });

        });

    }

}


// Usar la ruta fuera del archivo
module.exports = app;