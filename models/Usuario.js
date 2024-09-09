const mongoose = require('mongoose');
const {Schema} = mongoose;

const UsuarioSchema = new Schema({
    usuario: {
        type: String,
        required: true,
     
    },
    password: {
        type: String,
        required: true
    },
    nivelUsuario: {
        type: String,
        required: false,
        // enum: ['admin', 'usuario', 'supervisor'] // Ejemplo de niveles de usuario, puedes ajustar según necesites
    }
});


module.exports = mongoose.model('Usuario',UsuarioSchema);