const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnnoSchema = new Schema({
    anio:{
        type:Number,
        required:true,
    },

    
    // CONTABILIDAD

    // Total ingresos

    total_Ingresos:{
        type:Number,
        required:false,
        default:0,
    },
    
    totalImpuestosEspeciales_Ingresos:{
        type:Number,
        required:false,
        default:0,
    },
    
    totalImporte_Ingresos:{
        type:Number,
        required:false,
        default:0,
    },

    totalIVA_Ingresos:{
        type:Number,
        required:false,
        default:0,
    },

    // Total gastos

    total_Gastos:{
        type:Number,
        required:false,
        default:0,
    },

    
    totalImpuestosEspeciales_Gastos:{
        type:Number,
        required:false,
        default:0,
    },
    
    totalImpuestos_Gastos:{
        type:Number,
        required:false,
        default:0,
    },
    
    totalImporte_Gastos:{
        type:Number,
        required:false,
        default:0,
    },

    totalIVA_Gatsos:{
        type:Number,
        required:false,
        default:0,
    },


    // IVA

    totalIngresos_IVA:{
        type:Number,
        required:false,
        default:0,
    },

    totalegresos_IVA:{
        type:Number,
        required:false,
        default:0,
    },
    
    total_IVA:{
        type:Number,
        required:false,
        default:0,
    },
    pagoISR_IVA:{
        type:Number,
        required:false,
        default:0,
    },



    // CAJA CHICA


    Saldo:{
        type:Number,
        required:false,
        default:0,
    }

    

});

module.exports = mongoose.model('Anno',AnnoSchema);