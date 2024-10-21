const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmpleadoSchema = new Schema({
    nombre: {
        type: String,
        required: true
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

    // Se obtiene del prestamo,sele resta el abono se coloca en la nomina de la sig semana y se vacia
    deuda:{
        type:Number,
        required:false,
        default:0,
    },
    // Es solo el calculo provisional, se convierte a deuda una vez se cree la sig semana
    // proxDeuda:{
    //     type:Number,
    //     required:false,
    //     default:0,
    // },s

    abono:{
        type:Number,
        required:false,
        default:0
    }
});


module.exports = mongoose.model('Empleado',EmpleadoSchema);