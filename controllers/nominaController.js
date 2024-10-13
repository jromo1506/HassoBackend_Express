const mongoose = require('mongoose');
const {Schema } = mongoose;



const Nomina = require('../models/Nomina');

// Crear una nueva nómina
exports.createNomina = async (req, res) => {
    try {
        const nuevaNomina = new Nomina(req.body);
        const nominaGuardada = await nuevaNomina.save();
        res.status(201).json(nominaGuardada);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear la nómina', error });
    }
};

// Obtener todas las nóminas
exports.getNominas = async (req, res) => {
    try {
        const nominas = await Nomina.find();
        res.status(200).json(nominas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las nóminas', error });
    }
};

// Obtener una nómina por ID
exports.getNominaById = async (req, res) => {
    try {
        const { idSemana, idEmpleado } = req.params;
        const nomina = await Nomina.findOne({ idSemana, idEmpleado });
        if (!nomina) {
            return res.status(404).json({ message: 'Nómina no encontrada' });
        }
        res.status(200).json(nomina);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la nómina', error });
    }
};

// Actualizar una nómina por ID
exports.updateNomina = async (req, res) => {
    try {
        const { idSemana, idEmpleado } = req.params;
        const nominaActualizada = await Nomina.findOneAndUpdate(
            { idSemana, idEmpleado },
            req.body,
            { new: true } // Devuelve el documento actualizado
        );
        if (!nominaActualizada) {
            return res.status(404).json({ message: 'Nómina no encontrada' });
        }
        res.status(200).json(nominaActualizada);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la nómina', error });
    }
};

// Eliminar una nómina por ID
exports.deleteNomina = async (req, res) => {
    try {
        const { idSemana, idEmpleado } = req.params;
        const nominaEliminada = await Nomina.findOneAndDelete({ idSemana, idEmpleado });
        if (!nominaEliminada) {
            return res.status(404).json({ message: 'Nómina no encontrada' });
        }
        res.status(200).json({ message: 'Nómina eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la nómina', error });
    }
};


exports.getNominasBySemana = async (req, res) => {
    try {
        const { idSemana } = req.params;
        const nominas = await Nomina.find({ idSemana });
        if (nominas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron nóminas para esta semana' });
        }
        res.status(200).json(nominas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las nóminas', error });
    }
};
