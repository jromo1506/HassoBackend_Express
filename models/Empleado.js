const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmpleadoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    rfc: {
        type: String,
        required: true,
    },
    sueldoHora: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model('Empleado',EmpleadoSchema);