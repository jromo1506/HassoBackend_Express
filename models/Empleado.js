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
    }
});


module.exports = mongoose.model('Empleado',EmpleadoSchema);