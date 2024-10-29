const mongoose = require('mongoose');
const express = require('express');
const {Schema} = mongoose;


const IngresoSchema = new Schema({
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
        type: Number,
        required: false
    },
    importe: {
        type: Number,
        required: true
    },
    IVA: {
        type: Number,
        required: true
    },
    impEsp:{
        type:Number,
        required:false,
        default:0
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


module.exports = mongoose.model('Ingreso',IngresoSchema);