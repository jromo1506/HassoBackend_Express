const mongoose = require('mongoose');
const { Schema } = mongoose;

const HorasTrabajadasSchema = new Schema({
    idSemana: {
        type: Schema.Types.ObjectId,
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
    horasRegulares: {
        type: Number,
        required: true
    },
    horasExtras: {
        type: Number,
        required: true
    },
    pagoHorasRegulares: {
        type: Number,
        required: true
    },
    pagoHorasExtras: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model('HorasTrabajadas',HorasTrabajadasSchema);