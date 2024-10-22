const mongoose = require('mongoose');
const {Schema} = mongoose;

const SolicitudSchema = new Schema({
    idUsuario: {
        type: String,
        required: true
    },
    
    idCajaChica: {
        type: String,
        required: true
    },
    idSemana:{
        type: String,
        required: false
    },
    idConta:{
        type: String,
        required: false
    },

    nombreUsuario:{
        type: String,
        required: true
    },
    asunto:{
        type: String,
        required: true
    },
    mensaje:{
        type:String,
        required:true
    }
});

/*
TIPOS DE NOTIFICACIONES:
1 - Reposicion caja chica

*/

module.exports = mongoose.model('Solicitud',SolicitudSchema);