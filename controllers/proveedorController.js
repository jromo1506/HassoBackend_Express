const express = require('express');
const Proveedor = require('../models/Proveedor');

// Crear un nuevo proveedor
exports.createProveedor = async (req, res) => {
    try {
        const { nombre, idMovimiento } = req.body;

        // Verificar si el movimiento existe
        const movimiento = await Movimiento.findById(idMovimiento);
        if (!movimiento) {
            return res.status(404).json({ message: 'Movimiento no encontrado' });
        }

        // Crear un nuevo proveedor
        const nuevoProveedor = new Proveedor({
            nombre,
            idMovimiento
        });

        const proveedorGuardado = await nuevoProveedor.save();
        res.status(201).json(proveedorGuardado);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el proveedor', error });
    }
};

// Obtener todos los proveedores
exports.getProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.find().populate('idMovimiento');
        res.status(200).json(proveedores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los proveedores', error });
    }
};

// Obtener un proveedor por ID
exports.getProveedorById = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id).populate('idMovimiento');
        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.status(200).json(proveedor);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el proveedor', error });
    }
};

// Actualizar un proveedor
exports.updateProveedor = async (req, res) => {
    try {
        const { nombre, idMovimiento } = req.body;

        // Verificar si el movimiento existe
        const movimiento = await Movimiento.findById(idMovimiento);
        if (!movimiento) {
            return res.status(404).json({ message: 'Movimiento no encontrado' });
        }

        const proveedorActualizado = await Proveedor.findByIdAndUpdate(
            req.params.id,
            { nombre, idMovimiento },
            { new: true }
        ).populate('idMovimiento');

        if (!proveedorActualizado) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        res.status(200).json(proveedorActualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el proveedor', error });
    }
};

// Eliminar un proveedor
exports.deleteProveedor = async (req, res) => {
    try {
        const proveedorEliminado = await Proveedor.findByIdAndDelete(req.params.id);
        if (!proveedorEliminado) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.status(200).json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el proveedor', error });
    }
};