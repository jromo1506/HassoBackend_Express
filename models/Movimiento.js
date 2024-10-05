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
        type: String
    },
    numeroFactura: {
        type: String
    },
    fechaFactura: {
        type: String
    },
    proveedor:{
        type: String
    },
    razonSocial: {
        type: String
    },
    rfc: {
        type: String
    },
    formaDePago: {
        type: String,
        enum: ['Efectivo', 'Transferencia', 'Cheque', 'Tarjeta'], // Ejemplo de formas de pago, ajusta según necesites
        required: true
    },
    idCajaChica: {
        type: Schema.Types.ObjectId,
        ref: 'CajaChica',
        required: true
    }
});

module.exports = mongoose.model('Movimiento',MovimientoSchema);