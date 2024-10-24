const mongoose = require('mongoose');
const {Schema} = mongoose;

const ProveedorSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    rfc: {
        type: String,
        required: false
    },
    
    idMovimiento: {
        type: Schema.Types.ObjectId,
        ref: 'Movimiento',
        required: false
    }
});

module.exports = mongoose.model('Proveedor',ProveedorSchema);