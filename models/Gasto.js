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
    factura:{
        type:String,
        required:false,
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
        required: true
    }
});


module.exports = mongoose.model('Gasto',GastoSchema);