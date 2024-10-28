const Gasto = require('../models/Gasto');
const express = require('express');
const HojaContable = require('../models/HojaContable');

// Crear un nuevo Gasto
exports.crearGasto = async (req, res) => {
    try {
        const nuevoGasto = new Gasto(req.body);
        await nuevoGasto.save();
        res.status(201).json(nuevoGasto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los Gastos
exports.obtenerGastos = async (req, res) => {
    try {
        const gastos = await Gasto.find();
        res.status(200).json(gastos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un Gasto por ID
exports.obtenerGastoPorId = async (req, res) => {
    try {
        const gasto = await Gasto.findById(req.params.id);
        console.log(gasto,"gasto----------------------------------------")
        if (!gasto) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }
        res.status(200).json(gasto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un Gasto
exports.actualizarGasto = async (req, res) => {
    try {
        const gastoActualizado = await Gasto.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!gastoActualizado) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }
        res.status(200).json(gastoActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un Gasto
exports.eliminarGasto = async (req, res) => {
    try {
        const gastoEliminado = await Gasto.findByIdAndDelete(req.params.id);
        if (!gastoEliminado) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }
        res.status(200).json({ message: 'Gasto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getGastoByHojaContable = async (req, res) => {
    console.log(req.params)
    try {
        const { id } = req.params;
        
        const ingresos = await Gasto.find({ idHojaContable: id });
        console.log(ingresos)
        if (ingresos.length === 0) {
            const defaultGasto = {
                obra: "",
                fechaPago: "",
                concepto: "",
                total: 0,
                importe: 0,
                IVA: 0,
                fechaFactura: "",
                cliente: "",
                RFC: "",
                pedido: "",
                idHojaContable: ""
            };
            return res.json([defaultGasto]);
        }

        res.json(ingresos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los ingresos', error });
    }
};



exports.importarGastos = async (req, res) => {
    const gastosArray = req.body;

    try {
        // Usar insertMany para agregar todos los objetos en una sola llamada
        const result = await Gasto.insertMany(gastosArray);
        res.status(201).json({ message: 'Gastos agregados exitosamente', data: result });
    } 
    catch (error) {
        res.status(500).json({ message: 'Error al agregar gastos', error: error.message });
    }
};

exports.checarDuplicados = async(req,res) =>{
    try {
        const { RFC, fechaFactura } = req.body;

        // Verificar si ya existe un gasto con el mismo RFC y fecha de factura
        const existingGasto = await Gasto.findOne({ RFC, fechaFactura });
        if (existingGasto) {
            return res.status(400).json({ message: 'Ya existe un gasto con el mismo RFC o factura.' });
        }

        // Crear y guardar el nuevo gasto si no está duplicado
        const nuevoGasto = new Gasto(req.body);
        await nuevoGasto.save();

        res.status(201).json(nuevoGasto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al guardar el gasto.' });
    }
}

