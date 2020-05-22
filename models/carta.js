var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['VIGENTE', 'VENCIDA'],
    message: '{VALUE} no es un valor permitido'
};

var cartaSchema = new Schema({

    orden: { type: String, unique: true, required: [true, 'El orden es necesario'] },
    ruc: { type: String, required: [true, 'El RUC es necesario'] },
    razonSocial: { type: String, required: [true, 'La razon social es necesaria'] },
    nroCarta: { type: String, required: [true, 'El numero de carta es necesario'] },
    BancoRazonSocial: { type: String, required: [true, 'El banco es necesario'] },
    nroDocumento: { type: String, required: [true, 'El numero de documento es necesario'] },
    Monto: { type: String, required: [true, 'El	monto es necesario'] },
    Estado: { type: String, required: [true, 'El estado es necesario'], default: 'VIGENTE', enum: rolesValidos },
    AreaRespuesta: { type: String, required: [true, 'El area respuesta es necesario'] },
    FechaPresentacion: { type: Date, required: [true, 'La fecha presentacion es necesaria'] },
    FechaVencimiento: { type: Date, required: [true, 'La fecha vencimiento es necesaria'] },
    DocRelacionado: { type: String },
    FechaDocRelacionado: { type: Date },
    NroEsquelaSustitucion: { type: String },
    FechaSustitucion: { type: Date },
    FechaEjecucion: { type: Date },
    NroEsquelaDevolucion: { type: String },
    NroActaEntrega: { type: String },
    FechaDevolucion: { type: Date },
    RegistroResponsable: { type: String },
    Observaciones: { type: String }

});

module.exports = mongoose.model('Carta', cartaSchema);