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
        
        required: false
    },
    finiquito: {
        type: Number,
        
        required: false
    },

    deben: {
        type: Number,
        
        required: false
    },
    prestamo:{
        type: Number,
        
        required: false
    },
    abonan:{
        type: Number,
        
        required: false
    },
    pension:{
        type: Number,
        
        required: false
    },
    totalNomina: {
        type: Number,
        
        required: false
    },

    nominaFiscal:{
        type:Number,
        required: false
    },
    dispEfectivo:{
        type:Number,
        required:false
    }


});


module.exports = mongoose.model('Nomina',NominaSchema);