const mongoose = require('mongoose');
const {Schema} = mongoose;

const ProveedorSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    idMovimiento: {
        type: Schema.Types.ObjectId,
        ref: 'Movimiento',
        required: true
    }
});

module.exports = mongoose.model('Proveedor',ProveedorSchema);