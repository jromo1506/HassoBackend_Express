const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmpleadoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    RFC: {
        type: String,
        required: true,
        unique: true
    },
    sueldoHora: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model('Empleado',EmpleadoSchema);