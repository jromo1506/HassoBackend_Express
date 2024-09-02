const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProyectoSchema = new Schema({
    nombreProyecto: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Proyecto',ProyectoSchema);