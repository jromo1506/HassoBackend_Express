const mongoose = require('mongoose');
const {Schema} = mongoose;

const ClienteSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    rfc: {
        type: String,
        required: true
    },
    
    idMovimiento: {
        type: Schema.Types.ObjectId,
        ref: 'Movimiento',
        required: false
    }
});

module.exports = mongoose.model('Cliente',ClienteSchema);