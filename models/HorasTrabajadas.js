const mongoose = require('mongoose');
const { Schema } = mongoose;

const HorasTrabajadasSchema = new Schema({
    idSemana: {
        type: String,
        ref: 'Semana',
        required: true
    },
    idProyecto: {
        type: Schema.Types.ObjectId,
        ref: 'Proyecto',
        required: true
    },
    idEmpleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },
    nombreProyecto: {
        type: String,
        required: true
    },
    horasRegulares: {
        type: Number,
        required: true
    },
    horasExtras: {
        type: Boolean,
        required: true
    },
    pagoHorasRegulares: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model('HorasTrabajadas',HorasTrabajadasSchema);