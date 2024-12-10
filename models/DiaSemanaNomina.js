const mongoose = require('mongoose');
const {Schema } = mongoose;

const DiaSemanaNominaSchema = new Schema({
    // ID COMPUESTO
    idNomina: {
        type: String,
        required: true
    },
    diaSemana: {
        type: String,
        required: true
    },
    contador:{
        type:Number,
        required:true,
        default:9.5,
    },


});


module.exports = mongoose.model('DiasSemana',DiaSemanaNominaSchema);