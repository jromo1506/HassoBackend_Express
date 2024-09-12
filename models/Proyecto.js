const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProyectoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    clave:{
        type:String,
        required:false
    }
});



module.exports = mongoose.model('Proyecto',ProyectoSchema);