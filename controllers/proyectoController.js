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


exports.buscarProyecto = async (req, res) => {
    try {
        const { searchQuery } = req.query;

        if (!searchQuery) {
            return res.status(400).json({
                message: 'Debe proporcionar una cadena de búsqueda'
            });
        }

        // Crear expresión regular para la búsqueda insensible a mayúsculas y minúsculas
        const regex = new RegExp(searchQuery, 'i');

        // Buscar proyectos que coincidan en nombre o clave
        const proyectos = await Proyecto.find({
            $or: [
                { nombre: regex },
                { clave: regex }
            ]
        }).sort({ nombre: 1 }); // Ordenar alfabéticamente por nombre

        // Enviar resultados
        res.status(200).json({
            message: `Se encontraron ${proyectos.length} proyectos que coinciden con la búsqueda`,
            proyectos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al buscar proyectos',
            error: error.message
        });
    }
};