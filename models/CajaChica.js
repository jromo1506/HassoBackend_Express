const mongoose = require('mongoose');
const express = require('express');
const {Schema} = mongoose;

const CajaChicaSchema = new Schema({
    nombreCajaChica: {
        type: String,
        required: true
    },
    fechaHoja: {
        type: Date,
        required: true
    },
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});
module.exports = mongoose.model('CajaChica',CajaChicaSchema);