const mongoose = require('mongoose');
const { Schema } = mongoose;

const SemanaSchema = new Schema({
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaTermino: {
        type: Date,
        required: true
    },
    idHorasTrabajadas: [{
        type: Schema.Types.ObjectId,
        ref: 'HorasTrabajadas',
        required: true
    }]
});

module.exports = mongoose.model('Semana',SemanaSchema);