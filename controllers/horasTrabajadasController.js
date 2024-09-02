const HorasTrabajadas = require('../models/HorasTrabajadas');
const express = require('express');
const router = express.Router();


// Crear nuevas horas trabajadas
exports.createHorasTrabajadas = async (req, res) => {
    try {
        const horasTrabajadas = new HorasTrabajadas(req.body);
        await horasTrabajadas.save();
        res.status(201).json(horasTrabajadas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las horas trabajadas
exports.getHorasTrabajadas = async (req, res) => {
    try {
        const horasTrabajadas = await HorasTrabajadas.find().populate('idEmpleado idProyecto idSemana');
        res.status(200).json(horasTrabajadas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener horas trabajadas por ID
exports.getHorasTrabajadasById = async (req, res) => {
    try {
        const horasTrabajadas = await HorasTrabajadas.findById(req.params.id).populate('idEmpleado idProyecto idSemana');
        if (!horasTrabajadas) {
            return res.status(404).json({ error: 'Horas trabajadas no encontradas' });
        }
        res.status(200).json(horasTrabajadas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar horas trabajadas por ID
exports.updateHorasTrabajadas = async (req, res) => {
    try {
        const horasTrabajadas = await HorasTrabajadas.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!horasTrabajadas) {
            return res.status(404).json({ error: 'Horas trabajadas no encontradas' });
        }
        res.status(200).json(horasTrabajadas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar horas trabajadas por ID
exports.deleteHorasTrabajadas = async (req, res) => {
    try {
        const horasTrabajadas = await HorasTrabajadas.findByIdAndDelete(req.params.id);
        if (!horasTrabajadas) {
            return res.status(404).json({ error: 'Horas trabajadas no encontradas' });
        }
        res.status(200).json({ message: 'Horas trabajadas eliminadas' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
