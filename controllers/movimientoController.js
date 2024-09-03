
const express = require('express');
const Movimiento = require('../models/Movimiento');

// Crear un nuevo movimiento
exports.crearMovimiento = async (req, res) => {
    try {
        const nuevoMovimiento = new Movimiento(req.body);
        await nuevoMovimiento.save();
        res.status(201).json(nuevoMovimiento);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el movimiento', error });
    }
};

// Obtener todos los movimientos
exports.obtenerMovimientos = async (req, res) => {
    try {
        const movimientos = await Movimiento.find().populate('idCajaChica');
        res.status(200).json(movimientos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los movimientos', error });
    }
};

// Obtener un movimiento por ID
exports.obtenerMovimientoPorId = async (req, res) => {
    try {
        const movimiento = await Movimiento.findById(req.params.id).populate('idCajaChica');
        if (!movimiento) {
            return res.status(404).json({ message: 'Movimiento no encontrado' });
        }
        res.status(200).json(movimiento);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el movimiento', error });
    }
};

// Actualizar un movimiento
exports.actualizarMovimiento = async (req, res) => {
    try {
        const movimientoActualizado = await Movimiento.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movimientoActualizado) {
            return res.status(404).json({ message: 'Movimiento no encontrado' });
        }
        res.status(200).json(movimientoActualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el movimiento', error });
    }
};

// Eliminar un movimiento
exports.eliminarMovimiento = async (req, res) => {
    try {
        const movimientoEliminado = await Movimiento.findByIdAndDelete(req.params.id);
        if (!movimientoEliminado) {
            return res.status(404).json({ message: 'Movimiento no encontrado' });
        }
        res.status(200).json({ message: 'Movimiento eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el movimiento', error });
    }
};