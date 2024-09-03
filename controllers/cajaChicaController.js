const CajaChica = require('../models/CajaChica');
const express = require('express');
const router = express.Router();



// Crear una nueva caja chica
exports.crearCajaChica = async (req, res) => {
    try {
        const nuevaCajaChica = new CajaChica(req.body);
        await nuevaCajaChica.save();
        res.status(201).json(nuevaCajaChica);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la caja chica', error });
    }
};

// Obtener todas las cajas chicas
exports.obtenerCajasChicas = async (req, res) => {
    try {
        const cajasChicas = await CajaChica.find().populate('idUsuario');
        res.status(200).json(cajasChicas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las cajas chicas', error });
    }
};

// Obtener una caja chica por ID
exports.obtenerCajaChicaPorId = async (req, res) => {
    try {
        const cajaChica = await CajaChica.findById(req.params.id).populate('idUsuario');
        if (!cajaChica) {
            return res.status(404).json({ message: 'Caja chica no encontrada' });
        }
        res.status(200).json(cajaChica);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la caja chica', error });
    }
};

// Actualizar una caja chica
exports.actualizarCajaChica = async (req, res) => {
    try {
        const cajaChicaActualizada = await CajaChica.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cajaChicaActualizada) {
            return res.status(404).json({ message: 'Caja chica no encontrada' });
        }
        res.status(200).json(cajaChicaActualizada);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la caja chica', error });
    }
};

// Eliminar una caja chica
exports.eliminarCajaChica = async (req, res) => {
    try {
        const cajaChicaEliminada = await CajaChica.findByIdAndDelete(req.params.id);
        if (!cajaChicaEliminada) {
            return res.status(404).json({ message: 'Caja chica no encontrada' });
        }
        res.status(200).json({ message: 'Caja chica eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la caja chica', error });
    }
};