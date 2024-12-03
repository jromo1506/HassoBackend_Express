const mongoose = require('mongoose');
const express = require('express');
const {Schema} = mongoose;


const MovimientoContaSchema = new Schema({
    tipo:{
        type:String,
        required:true
    },
    folio:{
        type:String,
        required:false,
    },
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
        required:false
    },
    factura:{
        type:String,
        required:false,
    },
    fechaFactura: {
        type: String,
        required: true
    },
    proveedor:{
        type:String,
        required:false
    },
    RFC_Pro:{
        type:String,
        required:false
    },
    cliente: {
        type: String,
        required: false
    },
    RFC_Cli: {
        type: String,
        required: true
    },
    pedido: {
        type: String,
        required: true
    },
    formaDePago:{
        type:String,
        required:true
    },
   
    idHojaContable: {
        type: String,
        required: true
    },

});


module.exports = mongoose.model('MovimientoConta',GastoSchema);