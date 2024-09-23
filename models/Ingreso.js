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
        required: true
    },
    importe: {
        type: Number,
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
<<<<<<< HEAD
    },
    idHojaContable: {
        type: String,
        required: true
    }
=======
    }
    // idHojaContable: {
    //     type: String,
    //     required: true
    // }
>>>>>>> 1e19b2649ef64c48b44e90e850dfbcd7fcc060b8
});


module.exports = mongoose.model('Ingreso',IngresoSchema);