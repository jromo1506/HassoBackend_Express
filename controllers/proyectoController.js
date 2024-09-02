const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');

// Crear un nuevo proyecto
exports.createProyecto = async (req, res) => {
    try {
        const proyecto = new Proyecto(req.body);
        await proyecto.save();
        res.status(201).json(proyecto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los proyectos
exports.getProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find();
        res.status(200).json(proyectos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener un proyecto por ID
exports.getProyectoById = async (req, res) => {
    try {
        const proyecto = await Proyecto.findById(req.params.id);
        if (!proyecto) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        res.status(200).json(proyecto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un proyecto por ID
exports.updateProyecto = async (req, res) => {
    try {
        const proyecto = await Proyecto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!proyecto) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        res.status(200).json(proyecto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un proyecto por ID
exports.deleteProyecto = async (req, res) => {
    try {
        const proyecto = await Proyecto.findByIdAndDelete(req.params.id);
        if (!proyecto) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        res.status(200).json({ message: 'Proyecto eliminado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
