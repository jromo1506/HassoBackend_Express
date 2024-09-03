const mongoose = require('');
const {Schema} = mongoose;

const UsuarioSchema = new Schema({
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nivelUsuario: {
        type: String,
        required: true,
        enum: ['admin', 'usuario', 'supervisor'] // Ejemplo de niveles de usuario, puedes ajustar según necesites
    }
});


module.exports = mongoose.model('Usuario',UsuarioSchema);