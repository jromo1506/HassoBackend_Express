const mongoose = require('mongoose');
const { Schema } = mongoose;

const SemanaSchema = new Schema({
    fechaInicio: {
        type: String,
        required: true
    },
    fechaTermino: {
        type: String,
        required: true
    },
    idHorasTrabajadas: [{
        type: Schema.Types.ObjectId,
        ref: 'HorasTrabajadas',
        required: true
    }],
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    }
});

module.exports = mongoose.model('Semana',SemanaSchema);