const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmpleadoSchema = new Schema({
    id:{
        type:String,
        require:true
    },
    nombre: {
        type: String,
        required: true
    },
    apePat:{
        type:String,
        required:true
    },
    apeMat:{
        type:String,
        required:true
    },
    rfc: {
        type: String,
        required: true,
    },
    pago: {
        type: Number,
        required: true  
    },
    banco:{
        type:String,
        required:true
    },
    cuenta:{
        type:Number,
        required:true
    },
    tarjeta:{
        type:Number,
        required:true
    },

    deuda:{
        type:Number,
        required:false,
        default:0,
    },
    abono:{
        type:Number,
        required:false,
        default:0
    },

    curp:{
        type:String,
        required:true
    },
    puesto:{
        type:String,
        required:true
    },
    despedido:{
        type:Boolean,
        required:false,
        default:false
    }


});


module.exports = mongoose.model('Empleado',EmpleadoSchema);