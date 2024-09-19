const mongoose = require('mongoose');
const express = require('express');
const {Schema} = mongoose;


const HojaContableSchema = new Schema({
    nombreHoja: {
        type: String,
        required: true
    },
    fechaHoja: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});


module.exports = mongoose.model('HojaContable',HojaContableSchema);