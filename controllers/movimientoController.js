
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
    console.log(req.params, "obtenermovs")
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
        const movimiento = await Movimiento.find({ idCajaChica: req.params.id }).populate('idCajaChica');
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

exports.crearMovimientoConVerificacion = async (req, res) => {
    const restoDeDatos = req.body;

    const numeroFactura = restoDeDatos.numeroFactura;
    const rfc = restoDeDatos.rfc;
    const id = restoDeDatos.idCajaChica;

    // console.log('Hola');

    console.log('Rest: ', numeroFactura, rfc);

    try {
        // Verificar si ya existe un movimiento con el mismo numeroFactura o RFC
        const duplicado = await Movimiento.findOne({
            idCajaChica: id,
            $or: [
                { numeroFactura: numeroFactura },
                { rfc: rfc }
            ]
        });

        if (duplicado) {
            return res.status(400).json({
                mensaje: 'Ya existe un movimiento con el mismo número de factura o RFC.'
            });
        }

        // Crear y guardar el nuevo movimiento
        const nuevoMovimiento = new Movimiento({
            numeroFactura,
            rfc,
            id,
            ...restoDeDatos
        });

        console.log(nuevoMovimiento);
        

        await nuevoMovimiento.save();
        res.status(201).json(nuevoMovimiento);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el movimiento.',
            error: error.message
        });
    }
};


exports.checkedMovimiento = async (req, res) => {
    const { id } = req.params;
    const { checado } = req.body;

    try {
        // Buscar y actualizar el campo 'checado' del movimiento por su ID
        const movimientoActualizado = await Movimiento.findByIdAndUpdate(
            id,
            { checado },
            { new: true }
        );

        // Verificar si el movimiento existe
        if (!movimientoActualizado) {
            return res.status(404).json({
                mensaje: 'Movimiento no encontrado'
            });
        }

        res.status(200).json(movimientoActualizado);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el estado de checado',
            error: error.message
        });
    }
};


