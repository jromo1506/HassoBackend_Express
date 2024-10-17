const mongoose = require('mongoose');
const {Schema} = mongoose;

const MovimientoSchema = new Schema({
    obra: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
        required: true
    },
    concepto: {
        type: String,
        required: true
    },
    cargo: {
        type: Number,
        required: true
    },
    abono: {
        type: Number,
        required: true
    },
    // saldo: {
    //     type: Number,
    //     required: true
    // },
    comprobante: {
        type: String,
        required: false
    },
    numeroFactura: {
        type: String,
        required: false
    },
    fechaFactura: {
        type: String,
        required: false
    },
    proveedor:{
        type: String,
        required: false
    },
    razonSocial: {
        type: String,
        required: false
    },
    rfc: {
        type: String,
        required: false
    },
    formaDePago: {
        type: String,
        enum: ['Efectivo', 'Transferencia', 'Cheque', 'Tarjeta',''], // Ejemplo de formas de pago, ajusta según necesites
        required: false
    },
    idCajaChica: {
        type: Schema.Types.ObjectId,
        ref: 'CajaChica',
        required: true
    }
});

module.exports = mongoose.model('Movimiento',MovimientoSchema);


