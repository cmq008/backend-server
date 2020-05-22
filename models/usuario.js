// Importar
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE',
        'USER_ROLE',
        'SERVICIOS_ROLE',
        'RECLAMOS_ROLE',
        'CONTROL_ROLE',
        'AUDITORIA_ROLE',
        'OSA_ROLE',
        'SERVICIOS_ADM_ROLE',
        'RECLAMOS_ADM_ROLE',
        'CONTROL_ADM_ROLE',
        'AUDITORIA_ADM_ROLE',
        'OSA_ADM_ROLE',
    ],
    message: '{VALUE} no es un valor permitido'
};

var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El email es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false },
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);