const mongoose = require('mongoose');
const express = require('express');
const {Schema} = mongoose;


const GastoSchema = new Schema({
    obra: {
        type: String,
        required: true
    },
    fechaPago: {
        type: String,
        required: true
    },
    concepto: {
        type: String,
        required: true
    },
    total: {
        type: String,
        required: true
    },
    importe: {
        type: String,
        required: true
    },
    IVA: {
        type: Number,
        required: true
    },
    fechaFactura: {
        type: String,
        required: true
    },
    cliente: {
        type: String,
        required: true
    },
    RFC: {
        type: String,
        required: true
    },
    pedido: {
        type: String,
        required: true
    },
    idHojaContable: {
        type: String,
        required: false
    }
});


module.exports = mongoose.model('Gasto',GastoSchema);