var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var emailSchema = new Schema({

    from: { type: String, required: [true, 'El	correo es necesario'] },
    to: { type: String, required: [true, 'El	nombre	es	necesario'] },
    subject: { type: String, required: [true, 'El	nombre	es	necesario'] },
    cc: { type: String },
    html: { type: String, required: [true, 'El	nombre	es	necesario'] },
    attachments: { type: String },

});

module.exports = mongoose.model('Email', emailSchema);