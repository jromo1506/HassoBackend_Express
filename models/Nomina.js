const mongoose = require('mongoose');
const {Schema } = mongoose;

const NominaSchema = new Schema({
    // ID COMPUESTO
    idSemana: {
        type: String,
    
        required: true
    },
    idEmpleado: {
        type: String,
    
        required: true
    },


    nombreEmpleado: {
        type: String,
        
        required: true
    },
    sueldoMes: {
        type: Number,
        
        required: false
    },
    sueldoHora: {
        type: Number,
        
        required: true
    },
    banco: {
        type: String,
        
        required: true
    },
    cuenta:{
        type:String,
        required:true,
    },
    tarjeta: {
        type: String,
        
        required: true
    },
    horasFaltantes:{
        type:Number,
        required:false,
        default:48
    },

    sobreSueldo: {
        type: Number,
        required: false,
        default: 0
    },
    finiquito: {
        type: Number,
        required: false,
        default: 0
    },
    totalNomina: {
        type: Number,
        required: false,
        default: 0
    },
    deben: {
        type: Number,
        required: false,
        default: 0
    },
    prestamo: {
        type: Number,
        required: false,
        default: 0
    },
    abonan: {
        type: Number,
        required: false,
        default: 0
    },
    pension: {
        type: Number,
        required: false,
        default: 0
    },
    lesDoy: {
        type: Number,
        required: false,
        default: 0
    },
    nominaFiscal: {
        type: Number,
        required: false,
        default: 0
    },
    dispEfectivo: {
        type: Number,
        required: false,
        default: 0
    }
    


});


module.exports = mongoose.model('Nomina',NominaSchema);