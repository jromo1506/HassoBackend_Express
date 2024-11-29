const mongoose = require('mongoose');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const EmpleadoSchema = new Schema({
    idEmp:{
        type:Number,
        unique: true,
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

    // La deuda es el valor que se le asigna a la nomina.deuda cuando se crea una 
    //nueva semana, si la semana anterior e hizo un prestamo o abono, se le 
    // suman y restan a deuda antees de asignarla a la nueva semana
    sumaDeuda:{
        type:Number,
        required:false,
        default:0,
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


EmpleadoSchema.plugin(AutoIncrement, { inc_field: 'idEmp' });


module.exports = mongoose.model('Empleado',EmpleadoSchema);
