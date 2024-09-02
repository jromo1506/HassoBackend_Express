const express = require('express');
const router = express.Router();
const Empleado = require('../models/Empleado');

// Crear un nuevo empleado
exports.createEmpleado = async (req, res) => {
    try {
        const empleado = new Empleado(req.body);
        await empleado.save();
        res.status(201).json(empleado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los empleados
exports.getEmpleados = async (req, res) => {
    try {
        const empleados = await Empleado.find();
        res.status(200).json(empleados);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener un empleado por ID
exports.getEmpleadoById = async (req, res) => {
    try {
        const empleado = await Empleado.findById(req.params.id);
        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.status(200).json(empleado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un empleado por ID
exports.updateEmpleado = async (req, res) => {
    try {
        const empleado = await Empleado.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.status(200).json(empleado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un empleado por ID
exports.deleteEmpleado = async (req, res) => {
    try {
        const empleado = await Empleado.findByIdAndDelete(req.params.id);
        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.status(200).json({ message: 'Empleado eliminado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};