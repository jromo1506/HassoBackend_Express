const mongoose = require('mongoose');
const { Schema } = mongoose;

const HorasTrabajadasSchema = new Schema({
    idSemana: {
        type: String,
        ref: 'Semana',
        required: true
    },
    idProyecto: {
        type: Schema.Types.ObjectId,
        ref: 'Proyecto',
        required: true
    },
    idEmpleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },
    nombreProyecto: {
        type: String,
        required: true
    },
    nombreEmpleado:{
        type: String,
        required: true
    },
    horasTrabajadas:{
        type:Number,
        required:true
    },
    fecha: {
        type: Date,
        required: false
    },
    diaSemana:{
        type:String,
        required:true
    },
    sonHorasExtra:{
        type:Boolean,
        required:true
    }

});


module.exports = mongoose.model('HorasTrabajadas',HorasTrabajadasSchema);