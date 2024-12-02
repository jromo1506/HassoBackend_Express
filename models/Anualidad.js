const mongoose = require('mongoose');
const { Schema } = mongoose;

const SemanaSchema = new Schema({
    anio:{
        type:Number,
        required:true,
    },

    // Total ingresos

    total_Ingresos:{
        type:Number,
        required:true,
    },
    
    totalImpuestosEspeciales_Ingresos:{
        type:Number,
        required:true,
    },
    
    totalImporte_Ingresos:{
        type:Number,
        required:true,
    },

    totalIVA_Ingresos:{
        type:Number,
        required:true,
    },

    // Total gastos

    total_Gastos:{
        type:Number,
        required:true,
    },
    
    totalImpuestos_Gastos:{
        type:Number,
        required:true,
    },
    
    totalImporte_Gastos:{
        type:Number,
        required:true,
    },

    totalIVA_Gatsos:{
        type:Number,
        required:true,
    },


    // IVA

    totalIngresos_IVA:{
        type:Number,
        required:true,
    },

    totalegresos_IVA:{
        type:Number,
        required:true,
    },
    
    total_IVA:{
        type:Number,
        required:true,
    },
    pagoISR_IVA:{
        
    }

    

});

module.exports = mongoose.model('Semana',SemanaSchema);