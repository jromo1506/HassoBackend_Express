const CajaChica = require('../models/CajaChica');
const HojaContable = require('../models/HojaContable');
const express = require('express');
const router = express.Router();
/*
const Movimiento = require('../models/Movimiento');

exports.actualizarCajaChica = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Encuentra y actualiza el movimiento por su ID
    const updatedMovimiento = await Movimiento.findByIdAndUpdate(id, updatedData, {
      new: true, // Devuelve el documento actualizado
    });

    if (!updatedMovimiento) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }

    res.json(updatedMovimiento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el movimiento' });
  }
};
*/

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

exports.getCajasChicasByUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params; // Obtener el idUsuario desde los parámetros de la solicitud

        // Buscar las cajas chicas donde idUsuario coincida
        const cajasChicas = await CajaChica.find({ idUsuario }).populate('idUsuario');

        if (!cajasChicas.length) {
            const placeholderCajaChica = {
                nombreCajaChica: 'No se encontraron hojas para este usuario', // Valores predeterminados para el placeholder
                idUsuario: '', // Usamos el idUsuario que vino en la solicitud
            };
            return res.status(200).json([placeholderCajaChica]);
        }

        // Responder con las cajas chicas encontradas
        res.status(200).json(cajasChicas);
    } catch (error) {
        console.error('Error al obtener cajas chicas:', error);
        res.status(500).json({ message: 'Error al obtener las cajas chicas' });
    }
};


// Busca si existe una hoja contable con los mismos mes y anio que la caja chica para exportar los gastos

exports.buscarHojaContable = async (req, res) => {
    try {
        const { mes, anio } = req.body;
        console.log(mes + " " + anio ,"FECHA");
        // Verificar si existe una hoja de contable con el mismo mes y año
        const hojaContable = await HojaContable.findOne({ mes: mes, anio: anio });
        console.log(hojaContable,"HOJA CONT");
        if (!hojaContable) {
            return res.status(404).json({ message: 'No se encontró ninguna Hoja Contable para este mes y año' });
        }

        return res.status(200).json({ hojaContable });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al buscar la Hoja Contable' });
    }
};



